import * as cheerio from "cheerio";
import { CrawlData } from "@/types/geo";

/**
 * Dead-simple website fetcher. No retries, no batching, no browser.
 * Fetches a single URL, parses HTML with Cheerio, returns structured data.
 * On ANY failure returns an empty stub so the AI analysis still runs.
 */

// ── Fetch + parse a single URL ──────────────────────────────────

async function fetchPage(url: string): Promise<CrawlData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

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

  const textContent = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 800)
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

export async function crawlWebsiteDetailed(
  url: string,
  options: CrawlOptions = {},
): Promise<CrawlResult> {
  const pages = await crawlWebsite(url, options);
  return { pages, totalDiscovered: 1, maxPagesReached: false };
}
