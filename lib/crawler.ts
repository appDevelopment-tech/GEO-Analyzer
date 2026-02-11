import * as cheerio from "cheerio";
import { CrawlData } from "@/types/geo";
import { filterUrls, type SiteConfig } from "@/lib/url";
import puppeteer from "puppeteer-core";
import type { Browser, Page } from "puppeteer-core";

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
  /** Browser timeout (ms) */
  browserTimeout: 25000,
  /** Resource types to block for speed */
  blockedResourceTypes: [
    "image",
    "stylesheet",
    "font",
    "media",
  ] as const,
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
// BROWSER POOL — puppeteer-core + @sparticuz/chromium (serverless-safe)
// ============================================================================

/** Singleton browser instance reused across all pages */
let globalBrowser: Browser | null = null;
let browserRefCount = 0;

/**
 * Get or create the shared browser instance.
 * Uses @sparticuz/chromium on serverless (Lambda/Netlify),
 * falls back to local Chromium in dev.
 */
async function getBrowser(): Promise<Browser> {
  if (!globalBrowser || !globalBrowser.connected) {
    let executablePath: string;
    let args: string[];

    try {
      // On serverless: use bundled chromium from @sparticuz/chromium
      const chromium = (await import("@sparticuz/chromium")).default;
      executablePath = await chromium.executablePath();
      args = chromium.args;
    } catch {
      // Local dev fallback: expect chromium/chrome in PATH
      const possiblePaths = [
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      ];

      const fs = await import("fs");
      executablePath = possiblePaths.find((p) => fs.existsSync(p)) || "";

      if (!executablePath) {
        throw new Error(
          "No Chromium binary found. Install Chrome or set CHROME_PATH.",
        );
      }

      args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ];
    }

    globalBrowser = await puppeteer.launch({
      executablePath,
      args,
      headless: true,
      defaultViewport: { width: 1280, height: 720 },
    });

    browserRefCount = 0;
  }
  browserRefCount++;
  return globalBrowser;
}

/**
 * Close the browser if no more references
 */
async function maybeCloseBrowser(): Promise<void> {
  browserRefCount--;
  if (browserRefCount <= 0 && globalBrowser?.connected) {
    await globalBrowser.close();
    globalBrowser = null;
    browserRefCount = 0;
  }
}

/**
 * Close browser forcefully (for cleanup)
 */
export async function closeBrowser(): Promise<void> {
  if (globalBrowser?.connected) {
    await globalBrowser.close();
    globalBrowser = null;
    browserRefCount = 0;
  }
}

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
  /** Use headless browser for JS-rendered sites (Wix, React, Next.js, etc.)
   *  - false: use fetch (fast, for static sites)
   *  - true: use browser (for JS-rendered sites)
   *  - "auto": auto-detect based on HTML signatures
   */
  useBrowser?: boolean | "auto";
}

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

/**
 * Sleep/delay utility
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Crawl a single page using fetch (fast, no JS execution)
 * Includes retry logic with exponential backoff
 */
async function crawlPageFetch(url: string): Promise<CrawlData> {
  const cached = getCached(url);
  if (cached) return cached;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= CRAWLER_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GEO-Analyzer/1.0)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
      });

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
 * Crawl a single page using headless browser (for JS-rendered sites)
 * Uses puppeteer-core + @sparticuz/chromium for serverless compatibility
 */
async function crawlPageBrowser(url: string): Promise<CrawlData> {
  const cached = getCached(url);
  if (cached) return cached;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= CRAWLER_CONFIG.maxRetries; attempt++) {
    let page: Page | undefined;
    try {
      const browser = await getBrowser();
      page = await browser.newPage();

      // Set user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );

      // Block unnecessary resources for speed
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const type = req.resourceType();
        if (
          (CRAWLER_CONFIG.blockedResourceTypes as readonly string[]).includes(
            type,
          )
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate with timeout
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: CRAWLER_CONFIG.browserTimeout,
      });

      // Short wait for dynamic content to render
      await delay(1500);

      const html = await page.content();
      const result = parseHtmlContent(html, url);

      await page.close();
      await maybeCloseBrowser();

      setCached(url, result);
      return result;
    } catch (error) {
      lastError = error as Error;

      try {
        if (page) await page.close();
        await maybeCloseBrowser();
      } catch {}

      if (attempt < CRAWLER_CONFIG.maxRetries) {
        const retryDelay = CRAWLER_CONFIG.retryDelay * Math.pow(2, attempt);
        await delay(retryDelay);
      }
    }
  }

  throw new Error(
    `Failed to browser crawl ${url}: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Detection result for JS-rendered sites
 */
export interface JsDetectionResult {
  isJsRendered: boolean;
  framework?: string;
  confidence: number;
  reason: string;
}

/**
 * Known JS framework/CMS patterns for detection
 */
const JS_FRAMEWORK_PATTERNS = [
  {
    name: "Wix",
    pattern: /wix-static|static\.wixstatic\.com|wix-context/,
    confidence: 0.95,
  },
  {
    name: "Squarespace",
    pattern: /squarespace|squarespace\-context/,
    confidence: 0.9,
  },
  {
    name: "Webflow",
    pattern: /w\-static|webflow\-context|data\-wf\-site/,
    confidence: 0.9,
  },
  {
    name: "React (empty root)",
    pattern: /<div\s+id=["']root["']\s*><\/div>\s*<\/?body>/i,
    confidence: 0.85,
  },
  { name: "Next.js", pattern: /__NEXT_DATA__|id="__NEXT"/, confidence: 0.95 },
  {
    name: "Vue",
    pattern: /<div\s+id=["']app["']\s*><\/div>\s*<\/?body>/i,
    confidence: 0.85,
  },
  {
    name: "Angular",
    pattern: /<app-root|ng-version|<router\-outlet/,
    confidence: 0.9,
  },
  {
    name: "Shopify",
    pattern: /Shopify\.theme|shopify\-context/,
    confidence: 0.95,
  },
  {
    name: "BigCommerce",
    pattern: /stencilconnect|bigcommerce/,
    confidence: 0.9,
  },
];

/**
 * Auto-detect if a site uses JavaScript rendering
 */
export function detectJsRendering(html: string): JsDetectionResult {
  const $ = cheerio.load(html);

  for (const { name, pattern, confidence } of JS_FRAMEWORK_PATTERNS) {
    if (pattern.test(html)) {
      return {
        isJsRendered: true,
        framework: name,
        confidence,
        reason: `Detected ${name} pattern in HTML`,
      };
    }
  }

  const bodyContent = $("body").text().trim();
  const scriptCount = $("script").length;
  const htmlLength = html.length;
  const bodyLength = $("body").html()?.length || 0;

  const isEmptyBody = bodyContent.length < 200 && htmlLength > 10000;

  if (isEmptyBody && scriptCount >= 3) {
    return {
      isJsRendered: true,
      framework: "Unknown",
      confidence: 0.7,
      reason: `Minimal body content (${bodyContent.length} chars) with ${scriptCount} scripts`,
    };
  }

  if (/<div\s+id=["']root["']\s*><\/div>/.test(html) && scriptCount > 2) {
    return {
      isJsRendered: true,
      framework: "React (likely)",
      confidence: 0.75,
      reason: "Empty root div with multiple scripts",
    };
  }

  if (
    /react|react-dom|vue|angular|next|nuxt/i.test(html) &&
    bodyContent.length < 500
  ) {
    return {
      isJsRendered: true,
      framework: "SPA (likely)",
      confidence: 0.6,
      reason: "SPA library detected with minimal body content",
    };
  }

  return {
    isJsRendered: false,
    framework: undefined,
    confidence: 0.5,
    reason: "No JS rendering indicators found",
  };
}

/**
 * Auto-detect if a site needs browser rendering (fetch + detect)
 */
export async function detectJsRenderingOnline(
  url: string,
): Promise<JsDetectionResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GEO/AEO-Analyzer/1.0)",
      },
    });

    if (!response.ok) {
      return {
        isJsRendered: false,
        confidence: 0,
        reason: `Failed to fetch: ${response.status}`,
      };
    }

    const html = await response.text();
    return detectJsRendering(html);
  } catch {
    return {
      isJsRendered: true,
      confidence: 0.5,
      reason: "Fetch failed, using browser as fallback",
    };
  }
}

/**
 * Crawl a single page (internal - uses browser detection from caller)
 */
async function crawlPage(url: string, useBrowser: boolean): Promise<CrawlData> {
  try {
    if (useBrowser) {
      return await crawlPageBrowser(url);
    }
    return await crawlPageFetch(url);
  } catch (error) {
    throw new Error(`Crawl failed for ${url}: ${error}`);
  }
}

/**
 * Crawl multiple URLs concurrently with rate limiting
 */
async function crawlConcurrent(
  urls: string[],
  useBrowser: boolean,
): Promise<Map<string, CrawlData>> {
  const results = new Map<string, CrawlData>();
  const errors = new Map<string, Error>();

  for (let i = 0; i < urls.length; i += CRAWLER_CONFIG.concurrency) {
    const batch = urls.slice(i, i + CRAWLER_CONFIG.concurrency);

    const batchResults = await Promise.allSettled(
      batch.map((url) => crawlPage(url, useBrowser)),
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
  const { maxPages = 1, siteConfig, urlList, useBrowser = "auto" } = options;
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

  let detectedUseBrowser = false;
  let detectionResult: JsDetectionResult | undefined;

  if (useBrowser === "auto") {
    try {
      const detectionHtml = await (
        await fetch(normalizedUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        })
      ).text();
      detectionResult = detectJsRendering(detectionHtml);
      detectedUseBrowser = detectionResult.isJsRendered;

      console.log(
        `[Crawler] JS Detection: ${detectionResult.isJsRendered ? "Using browser" : "Using fetch"} (${detectionResult.reason})`,
      );
    } catch {
      detectedUseBrowser = true;
    }
  } else {
    detectedUseBrowser = useBrowser;
  }

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
      detectedUseBrowser,
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
