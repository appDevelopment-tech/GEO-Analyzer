/**
 * URL Filtering Module
 *
 * Filters and classifies URLs based on site-specific patterns.
 */

import type { SiteConfig, UrlCategory, UrlFilterResult, UrlPattern, PriorityLevel } from "./types";

/**
 * Normalize URL for comparison (removes trailing slash, hash, etc.)
 */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Remove hash and trailing slash
    return u.href.split("#")[0].replace(/\/$/, "");
  } catch {
    return url;
  }
}

/**
 * Extract pathname from URL
 */
export function extractPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/**
 * Check if a URL matches a pattern
 */
function matchesPattern(url: URL, pattern: UrlPattern): boolean {
  if (typeof pattern.match === "string") {
    return url.pathname.toLowerCase().includes(pattern.match.toLowerCase());
  }
  if (pattern.match instanceof RegExp) {
    return pattern.match.test(url.pathname);
  }
  if (typeof pattern.match === "function") {
    return pattern.match(url);
  }
  return false;
}

/**
 * Classify a single URL based on site config
 */
export function classifyUrl(
  rawUrl: string,
  config: SiteConfig
): UrlFilterResult {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return {
      url: rawUrl,
      priority: 10,
      category: "other" as UrlCategory,
      shouldCrawl: false,
      reason: "Invalid URL",
    };
  }

  // Check if same domain
  if (url.hostname !== config.domain && url.hostname !== `www.${config.domain}`) {
    return {
      url: rawUrl,
      priority: 10,
      category: "other" as UrlCategory,
      shouldCrawl: false,
      reason: "External link",
    };
  }

  // Check patterns in order (first match wins)
  for (const pattern of config.patterns) {
    if (matchesPattern(url, pattern)) {
      return {
        url: normalizeUrl(rawUrl),
        priority: pattern.priority,
        category: pattern.category,
        shouldCrawl: pattern.include,
        reason: pattern.reason,
      };
    }
  }

  // Default: include with low priority
  return {
    url: normalizeUrl(rawUrl),
    priority: 7,
    category: "other" as UrlCategory,
    shouldCrawl: true,
  };
}

/**
 * Filter and prioritize a list of URLs
 */
export function filterUrls(
  urls: readonly string[],
  config: SiteConfig
): readonly UrlFilterResult[] {
  const seen = new Set<string>();
  const results: UrlFilterResult[] = [];

  for (const url of urls) {
    const result = classifyUrl(url, config);
    const normalized = normalizeUrl(url);

    // Skip duplicates
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    results.push(result);
  }

  // Sort by priority (ascending), then by category
  return results.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.category.localeCompare(b.category);
  });
}

/**
 * Get only crawlable URLs up to a limit
 */
export function getCrawlableUrls(
  results: readonly UrlFilterResult[],
  limit?: number
): readonly string[] {
  const crawlable = results.filter((r) => r.shouldCrawl);
  const limited = limit ? crawlable.slice(0, limit) : crawlable;
  return limited.map((r) => r.url);
}

/**
 * Deduplicate URLs by normalized form
 */
export function dedupeUrls(urls: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const url of urls) {
    const normalized = normalizeUrl(url);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(url);
    }
  }

  return result;
}

/**
 * Get priority as a number (lower = higher priority)
 */
export function getPriorityScore(priority: PriorityLevel): number {
  return priority;
}

/**
 * Check if a priority is high (1-3)
 */
export function isHighPriority(priority: PriorityLevel): boolean {
  return priority <= 3;
}

/**
 * Check if a priority is medium (4-6)
 */
export function isMediumPriority(priority: PriorityLevel): boolean {
  return priority >= 4 && priority <= 6;
}

/**
 * Check if a priority is low (7+)
 */
export function isLowPriority(priority: PriorityLevel): boolean {
  return priority >= 7;
}
