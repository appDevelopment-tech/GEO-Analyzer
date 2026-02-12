import * as cheerio from "cheerio";
import { CrawlData } from "@/types/geo";

const HEDGING_WORDS = [
  "may",
  "might",
  "can",
  "could",
  "helps",
  "holistic",
  "possibly",
  "sometimes",
  "often",
];

// ============================================================================
// CRAWLER CONFIGURATION
// ============================================================================

const CRAWLER_CONFIG = {
  /** Maximum concurrent page crawls */
  concurrency: 5,
  /** Delay between batch requests (ms) for politeness */
  batchDelay: 100,
  /** Maximum retries per page */
  maxRetries: 1,
  /** Initial retry delay (ms) - exponential backoff */
  retryDelay: 400,
  /** Fetch timeout (ms) — 5s leaves ~20s for OpenAI within Netlify's 26s budget */
  fetchTimeout: 5000,
} as const;

// ============================================================================
// SIMPLE CACHE
// ============================================================================

/** Simple in-memory cache for crawl results */
const crawlCache = new Map<string, { data: CrawlData; timestamp: number }>();

// ── Fetch + parse a single URL ──────────────────────────────────

async function fetchPage(url: string): Promise<CrawlData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CRAWLER_CONFIG.fetchTimeout);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GEOAnalyzer/1.0; +https://geo-analyzer.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[Fetch] ${url} returned ${res.status}`);
      return emptyStub(url);
    }

    const html = await res.text();
    return parseHtml(html, url);
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`[Fetch] ${url} failed: ${err.message}`);
    return emptyStub(url);
  }
}

// ── HTML parsing ────────────────────────────────────────────────

function parseHtml(html: string, url: string): CrawlData {
  const $ = cheerio.load(html);

  // Extract JSON-LD before removing scripts
  const jsonLd: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonLd.push(JSON.parse($(el).html() || "{}"));
    } catch {
      // skip invalid
    }
  });

  $("script, style, nav, footer").remove();

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get();
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get();
  const h3 = $("h3").map((_, el) => $(el).text().trim()).get();

  // Extract text content (first 500 words — enough for AI analysis)
  const textContent = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 500)
    .join(" ");

  return {
    url,
    title: $("title").text() || "",
    metaDescription: $('meta[name="description"]').attr("content") || "",
    headings: { h1, h2, h3 },
    html,
    cleanedHtml: $.html() || "",
    textContent,
    jsonLd,
    signals: {
      entityMentions: extractEntities($, textContent),
      locationMentions: extractLocations(textContent),
      dateMentions: [],
      hedgingWords: 0,
      directAnswerBlocks: extractDirectAnswers($),
    },
  };
}

// ── Empty stub (returned on failure) ────────────────────────────

function emptyStub(url: string): CrawlData {
  return {
    url,
    title: "",
    metaDescription: "",
    headings: { h1: [], h2: [], h3: [] },
    html: "",
    cleanedHtml: "",
    textContent: "",
    jsonLd: [],
    signals: {
      entityMentions: [],
      locationMentions: [],
      dateMentions: [],
      hedgingWords: 0,
      directAnswerBlocks: [],
    },
  };
}

// ── Lightweight signal extraction ───────────────────────────────

function extractEntities($: cheerio.CheerioAPI, text: string): string[] {
  const m: string[] = [];
  const patterns = [
    /(\w+(?:\s+\w+)*)\s+is\s+an?\s+([^.]+)/gi,
    /(\w+(?:\s+\w+)*)\s+specializes?\s+in\s+([^.]+)/gi,
  ];
  for (const p of patterns) {
    let match;
    while ((match = p.exec(text)) !== null) m.push(match[0]);
  }
  return m.slice(0, 5);
}

function extractLocations(text: string): string[] {
  const p = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s+([A-Z]{2})\b/g;
  const m: string[] = [];
  let match;
  while ((match = p.exec(text)) !== null) m.push(match[0]);
  return Array.from(new Set(m)).slice(0, 5);
}

function extractDirectAnswers($: cheerio.CheerioAPI): string[] {
  const blocks: string[] = [];
  const qPat = [/\?/, /\bwhat\b/i, /\bhow\b/i, /\bwhy\b/i, /\bwho\b/i, /\bwhere\b/i];

  $("h1, h2, h3, h4").each((_, el) => {
    const heading = $(el).text().trim();
    if (!qPat.some((p) => p.test(heading))) return;

    const parts: string[] = [];
    let cur = $(el).next();
    while (cur.length && !cur.is("h1, h2, h3, h4")) {
      const t = cur.text().trim();
      if (t.length > 10) parts.push(t);
      cur = cur.next();
      if (parts.join(" ").split(/\s+/).length > 100) break;
    }
    const answer = parts.join(" ").trim();
    const wc = answer.split(/\s+/).length;
    if (wc >= 15 && wc <= 150) blocks.push(`Q: ${heading}\nA: ${answer}`);
  });

  return blocks.slice(0, 5);
}

// ── Internal link discovery ──────────────────────────────────────

/**
 * Discover internal links from the crawled homepage HTML.
 * Returns unique same-origin URLs sorted by likely importance:
 * 1. /about, /services, /pricing, /faq, /contact — high value for AI signals
 * 2. Other top-level paths (short URLs, not blog posts or assets)
 */
function discoverInternalLinks(
  homepageHtml: string,
  baseUrl: string,
  maxLinks: number = 10,
): string[] {
  const $ = cheerio.load(homepageHtml);
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return [];
  }

  const seen = new Set<string>();
  seen.add(baseUrl.replace(/\/$/, ""));

  const HIGH_VALUE_PATTERNS = [
    /\/(about|company|who-we-are)/i,
    /\/(services|solutions|what-we-do|offerings)/i,
    /\/(pricing|plans|packages|rates)/i,
    /\/(faq|frequently-asked|help|support)/i,
    /\/(contact|get-in-touch|reach-us)/i,
    /\/(team|people|staff|leadership)/i,
    /\/(reviews|testimonials|case-studies)/i,
    /\/(products|features|capabilities)/i,
  ];

  const SKIP_PATTERNS = [
    /\.(pdf|jpg|jpeg|png|gif|svg|webp|css|js|zip|mp4|mp3)$/i,
    /\/(blog|news|press|media|events|archive)\//i,
    /#/,
    /\?/,
    /\/(wp-admin|wp-content|wp-includes|cdn-cgi)\//i,
    /\/(login|signup|register|cart|checkout)\//i,
    /mailto:/i,
    /tel:/i,
    /javascript:/i,
  ];

  const highValue: string[] = [];
  const others: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    let fullUrl: string;
    try {
      fullUrl = new URL(href, baseUrl).href.replace(/\/$/, "");
    } catch {
      return;
    }

    // Same origin only
    if (!fullUrl.startsWith(origin)) return;
    if (seen.has(fullUrl)) return;
    if (SKIP_PATTERNS.some((p) => p.test(fullUrl))) return;

    seen.add(fullUrl);

    // Classify
    const path = new URL(fullUrl).pathname;
    if (path === "/" || path === "") return; // skip homepage duplicate

    // Prefer short, top-level paths (e.g., /about vs /blog/2024/post-title)
    const depth = path.split("/").filter(Boolean).length;
    if (depth > 2) return; // skip deep pages

    if (HIGH_VALUE_PATTERNS.some((p) => p.test(path))) {
      highValue.push(fullUrl);
    } else {
      others.push(fullUrl);
    }
  });

  // Return high-value first, then others, up to maxLinks
  return [...highValue, ...others].slice(0, maxLinks);
}

// ── Public API ──────────────────────────────────────────────────

/** Keep the old signature so nothing else breaks */
export interface CrawlOptions {
  maxPages?: number;
  siteConfig?: any;
  urlList?: readonly string[];
  useBrowser?: boolean | "auto";
}

export interface CrawlResult {
  pages: CrawlData[];
  totalDiscovered: number;
  maxPagesReached: boolean;
  suggestedAction?: string;
}

/**
 * Fetch a single URL and return parsed data.
 * Always returns at least one item (empty stub on failure).
 */
export async function crawlWebsite(
  url: string,
  _options: CrawlOptions = {},
): Promise<CrawlData[]> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
  const page = await fetchPage(normalizedUrl);
  return [page];
}

/**
 * Crawl the homepage + up to (maxPages - 1) additional internal pages.
 * Used by the paid deep-analysis flow for richer multi-page reports.
 */
export async function crawlMultiplePages(
  url: string,
  maxPages: number = 3,
): Promise<CrawlData[]> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  // Step 1: Crawl homepage
  const homepage = await fetchPage(normalizedUrl);
  const pages: CrawlData[] = [homepage];

  if (maxPages <= 1 || !homepage.html) return pages;

  // Step 2: Discover internal links from homepage
  const internalLinks = discoverInternalLinks(homepage.html, normalizedUrl, maxPages * 2);
  console.log(`[MultiCrawl] Found ${internalLinks.length} internal links, will crawl up to ${maxPages - 1} more`);

  // Step 3: Crawl additional pages concurrently (respect concurrency limit)
  const toFetch = internalLinks.slice(0, maxPages - 1);
  const results = await Promise.allSettled(
    toFetch.map((link) => fetchPage(link)),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.textContent.length > 50) {
      pages.push(result.value);
    }
  }

  console.log(`[MultiCrawl] Successfully crawled ${pages.length} pages total`);
  return pages;
}

export async function crawlWebsiteDetailed(
  url: string,
  options: CrawlOptions = {},
): Promise<CrawlResult> {
  const pages = await crawlWebsite(url, options);
  return { pages, totalDiscovered: 1, maxPagesReached: false };
}
