import * as cheerio from "cheerio";
import { CrawlData } from "@/types/geo";
import { filterUrls, type SiteConfig } from "@/lib/url";

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
  concurrency: 3,
  /** Delay between batch requests (ms) for politeness */
  batchDelay: 300,
  /** Maximum retries per page */
  maxRetries: 2,
  /** Initial retry delay (ms) - exponential backoff */
  retryDelay: 1000,
  /** Fetch timeout (ms) */
  fetchTimeout: 15000,
} as const;

// ============================================================================
// SIMPLE CACHE
// ============================================================================

/** Simple in-memory cache for crawl results */
const crawlCache = new Map<string, { data: CrawlData; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(url: string): CrawlData | null {
  const cached = crawlCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    crawlCache.delete(url);
  }
  return null;
}

function setCached(url: string, data: CrawlData): void {
  crawlCache.set(url, { data, timestamp: Date.now() });
}

// ============================================================================
// CRAWL OPTIONS
// ============================================================================

/**
 * Crawl options for website crawling
 */
export interface CrawlOptions {
  /** Maximum number of pages to crawl */
  maxPages?: number;
  /** Site-specific config for URL filtering (uses default if not provided) */
  siteConfig?: SiteConfig;
  /** Pre-defined list of URLs to crawl (skips discovery) */
  urlList?: readonly string[];
  /** @deprecated Browser mode removed — fetch-only now. Kept for API compat. */
  useBrowser?: boolean | "auto";
}

// ============================================================================
// HTML PARSING & SIGNAL EXTRACTION
// ============================================================================

/**
 * Parse HTML content and extract GEO signals
 */
function parseHtmlContent(html: string, url: string): CrawlData {
  const $ = cheerio.load(html);

  // Extract JSON-LD FIRST (before removing scripts)
  const jsonLd: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonLd.push(JSON.parse($(el).html() || "{}"));
    } catch (e) {
      // Skip invalid JSON-LD
    }
  });

  // Remove script and style tags (JSON-LD already extracted)
  $("script, style, nav, footer").remove();

  // Extract headings
  const h1 = $("h1")
    .map((_, el) => $(el).text().trim())
    .get();
  const h2 = $("h2")
    .map((_, el) => $(el).text().trim())
    .get();
  const h3 = $("h3")
    .map((_, el) => $(el).text().trim())
    .get();

  // Extract text content (first 2000 words)
  const textContent = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 2000)
    .join(" ");

  // Signal extraction
  const signals = {
    entityMentions: extractEntityMentions($, textContent),
    locationMentions: extractLocationMentions(textContent),
    dateMentions: extractDates(textContent),
    hedgingWords: countHedgingWords(textContent),
    directAnswerBlocks: extractDirectAnswerBlocks($),
  };

  return {
    url,
    title: $("title").text() || "",
    metaDescription: $('meta[name="description"]').attr("content") || "",
    headings: { h1, h2, h3 },
    html,
    cleanedHtml: $.html() || "",
    textContent,
    jsonLd,
    signals,
  };
}

// ============================================================================
// FETCH-BASED CRAWLER
// ============================================================================

/**
 * Sleep/delay utility
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Crawl a single page using fetch with retry + exponential backoff.
 * Uses a realistic browser User-Agent so servers don't block us.
 */
async function crawlPage(url: string): Promise<CrawlData> {
  const cached = getCached(url);
  if (cached) return cached;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= CRAWLER_CONFIG.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(),
        CRAWLER_CONFIG.fetchTimeout,
      );

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const result = parseHtmlContent(html, url);
      setCached(url, result);
      return result;
    } catch (error) {
      lastError = error as Error;
      if (attempt < CRAWLER_CONFIG.maxRetries) {
        const retryDelay = CRAWLER_CONFIG.retryDelay * Math.pow(2, attempt);
        await delay(retryDelay);
      }
    }
  }

  throw new Error(
    `Failed to fetch ${url}: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Crawl multiple URLs concurrently with rate limiting
 */
async function crawlConcurrent(
  urls: string[],
): Promise<Map<string, CrawlData>> {
  const results = new Map<string, CrawlData>();
  const errors = new Map<string, Error>();

  for (let i = 0; i < urls.length; i += CRAWLER_CONFIG.concurrency) {
    const batch = urls.slice(i, i + CRAWLER_CONFIG.concurrency);

    const batchResults = await Promise.allSettled(
      batch.map((url) => crawlPage(url)),
    );

    for (let j = 0; j < batch.length; j++) {
      const result = batchResults[j];
      const url = batch[j];

      if (result.status === "fulfilled") {
        results.set(url, result.value);
      } else {
        errors.set(url, result.reason);
        console.error(`[Crawler] Failed to crawl ${url}:`, result.reason);
      }
    }

    if (i + CRAWLER_CONFIG.concurrency < urls.length) {
      await delay(CRAWLER_CONFIG.batchDelay);
    }
  }

  if (errors.size > 0) {
    console.warn(
      `[Crawler] ${errors.size}/${urls.length} pages failed to crawl`,
    );
  }

  return results;
}

// ============================================================================
// SIGNAL EXTRACTION HELPERS
// ============================================================================

function extractEntityMentions($: cheerio.CheerioAPI, text: string): string[] {
  const mentions: string[] = [];
  const patterns = [
    /(\w+(?:\s+\w+)*)\s+is\s+an?\s+([^.]+)/gi,
    /(\w+(?:\s+\w+)*)\s+specializes?\s+in\s+([^.]+)/gi,
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      mentions.push(match[0]);
    }
  });

  return mentions.slice(0, 5);
}

function extractLocationMentions(text: string): string[] {
  const locationPattern =
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s+([A-Z]{2})\b/g;
  const matches: string[] = [];
  let match;

  while ((match = locationPattern.exec(text)) !== null) {
    matches.push(match[0]);
  }

  return Array.from(new Set(matches)).slice(0, 5);
}

function extractDates(text: string): string[] {
  const datePattern =
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi;
  const matches: string[] = [];
  let match;

  while ((match = datePattern.exec(text)) !== null) {
    matches.push(match[0]);
  }

  return Array.from(new Set(matches)).slice(0, 5);
}

function countHedgingWords(text: string): number {
  const lowerText = text.toLowerCase();
  return HEDGING_WORDS.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = lowerText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function extractDirectAnswerBlocks($: cheerio.CheerioAPI): string[] {
  const blocks: string[] = [];

  const questionPatterns = [
    /\?/,
    /\bwhat\b/i,
    /\bwho\b/i,
    /\bwhere\b/i,
    /\bwhen\b/i,
    /\bwhy\b/i,
    /\bhow\b/i,
    /\bwhich\b/i,
  ];

  $("h1, h2, h3, h4").each((_, el) => {
    const heading = $(el).text().trim();
    const isQuestion = questionPatterns.some((p) => p.test(heading));

    if (isQuestion) {
      const contentParts: string[] = [];
      let currentEl = $(el).next();

      while (currentEl.length && !currentEl.is("h1, h2, h3, h4")) {
        const text = currentEl.text().trim();
        if (text && text.length > 10) {
          contentParts.push(text);
        }
        currentEl = currentEl.next();
        if (contentParts.join(" ").split(/\s+/).length > 100) break;
      }

      const fullAnswer = contentParts.join(" ").trim();
      const wordCount = fullAnswer.split(/\s+/).length;
      if (wordCount >= 15 && wordCount <= 150) {
        blocks.push(`Q: ${heading}\nA: ${fullAnswer}`);
      }
    }
  });

  return blocks.slice(0, 5);
}

// ============================================================================
// LINK DISCOVERY
// ============================================================================

/**
 * Extract all internal links from a page with priority scoring
 */
function extractLinks(
  html: string,
  pageUrl: URL,
): Array<{ url: string; priority: number }> {
  const $ = cheerio.load(html);
  const links: Array<{ url: string; priority: number }> = [];
  const seen = new Set<string>();

  $("a[href]").each((_, el) => {
    try {
      const href = $(el).attr("href");
      if (!href) return;

      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      const absoluteUrl = new URL(href, pageUrl);

      if (absoluteUrl.origin === pageUrl.origin) {
        const cleanUrl = absoluteUrl.href.split("#")[0].replace(/\/$/, "");
        if (!seen.has(cleanUrl)) {
          seen.add(cleanUrl);
          links.push({
            url: absoluteUrl.href,
            priority: getPagePriority(absoluteUrl.pathname),
          });
        }
      }
    } catch {
      // Invalid URL, skip
    }
  });

  return links;
}

function getPagePriority(pathname: string): number {
  const path = pathname.toLowerCase();
  if (path === "" || path === "/") return 1;
  if (path.includes("about")) return 2;
  if (path.includes("contact")) return 2;
  if (path.includes("service") || path.includes("services")) return 3;
  if (path.includes("product") || path.includes("products")) return 3;
  if (path.includes("pricing")) return 3;
  if (path.includes("portfolio") || path.includes("work")) return 3;
  if (path.includes("faq")) return 4;
  if (path.includes("review") || path.includes("testimonial")) return 4;
  if (path.includes("case-stud") || path.includes("casestud")) return 4;
  if (path.includes("team")) return 5;
  if (path === "/blog" || path === "/blog/") return 6;
  if (path.includes("/blog/")) return 8;
  if (path.includes("privacy") || path.includes("terms")) return 20;
  if (path.includes("cookie") || path.includes("legal")) return 20;
  return 7;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Crawl result with metadata about the crawl
 */
export interface CrawlResult {
  pages: CrawlData[];
  totalDiscovered: number;
  maxPagesReached: boolean;
  suggestedAction?: string;
}

/**
 * Crawl a website with configurable page limit, dynamically discovering links
 */
export async function crawlWebsiteDetailed(
  url: string,
  options: CrawlOptions = {},
): Promise<CrawlResult> {
  const { maxPages = 1, siteConfig, urlList } = options;
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  const toCrawl: Array<{ url: string; priority: number }> = [];
  const crawled = new Set<string>();
  const results: CrawlData[] = [];
  const allDiscovered = new Set<string>();

  if (urlList && urlList.length > 0) {
    const filtered = siteConfig
      ? filterUrls(urlList, siteConfig)
      : urlList.map((u) => ({
          url: u,
          priority: 5,
          category: "other" as const,
          shouldCrawl: true,
        }));

    for (const item of filtered) {
      if (item.shouldCrawl) {
        toCrawl.push({ url: item.url, priority: item.priority });
        allDiscovered.add(item.url);
      }
    }
  } else {
    toCrawl.push({ url: normalizedUrl, priority: 1 });
    allDiscovered.add(normalizedUrl);
  }

  while (toCrawl.length > 0 && results.length < maxPages) {
    toCrawl.sort((a, b) => a.priority - b.priority);

    const batchSize = Math.min(
      CRAWLER_CONFIG.concurrency,
      maxPages - results.length,
      toCrawl.length,
    );

    const batch: Array<{ url: string; priority: number }> = [];
    while (batch.length < batchSize && toCrawl.length > 0) {
      const item = toCrawl.shift()!;
      const cleanUrl = item.url.split("#")[0].replace(/\/$/, "");

      if (!crawled.has(cleanUrl)) {
        crawled.add(cleanUrl);
        batch.push(item);
      }
    }

    if (batch.length === 0) continue;

    const batchResults = await crawlConcurrent(
      batch.map((b) => b.url),
    );

    for (const { url } of batch) {
      const data = batchResults.get(url);
      if (data) {
        results.push(data);

        const discoveredLinks = extractLinks(data.html, new URL(url));
        for (const { url: link, priority } of discoveredLinks) {
          const cleanLink = link.split("#")[0].replace(/\/$/, "");
          allDiscovered.add(cleanLink);
          if (results.length < maxPages) {
            if (
              !crawled.has(cleanLink) &&
              !toCrawl.some((item) => item.url === link)
            ) {
              toCrawl.push({ url: link, priority });
            }
          }
        }
      }
    }

    if (results.length < maxPages && toCrawl.length > 0) {
      await delay(CRAWLER_CONFIG.batchDelay);
    }
  }

  const totalDiscovered = allDiscovered.size;
  const maxPagesReached = results.length >= maxPages;

  let suggestedAction: string | undefined;
  if (totalDiscovered > maxPages * 2) {
    suggestedAction = `Your site has ${totalDiscovered} pages but we analyzed ${maxPages}. For comprehensive analysis of all pages, contact us for enterprise pricing.`;
  } else if (totalDiscovered > maxPages) {
    suggestedAction = `We found ${totalDiscovered} pages total and analyzed the ${maxPages} most important ones. For full site analysis, consider our enterprise tier.`;
  }

  return {
    pages: results,
    totalDiscovered,
    maxPagesReached,
    suggestedAction,
  };
}

/**
 * Crawl a website and return only the page data (backward-compatible API)
 */
export async function crawlWebsite(
  url: string,
  options: CrawlOptions = {},
): Promise<CrawlData[]> {
  const result = await crawlWebsiteDetailed(url, options);
  return result.pages;
}
