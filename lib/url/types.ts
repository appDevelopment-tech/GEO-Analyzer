/**
 * URL Filtering and Prioritization System
 *
 * Provides modular, site-specific URL filtering for crawling.
 * Each site can define its own priority rules and inclusion/exclusion patterns.
 */

/**
 * Priority level for a URL (lower = higher priority)
 */
export type PriorityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Result of URL filtering
 */
export interface UrlFilterResult {
  readonly url: string;
  readonly priority: PriorityLevel;
  readonly category: UrlCategory;
  readonly shouldCrawl: boolean;
  readonly reason?: string;
}

/**
 * URL categories for classification
 */
export enum UrlCategory {
  /** Homepage and core landing pages */
  CORE = "core",
  /** Blog posts and articles */
  BLOG = "blog",
  /** Product/Service pages */
  PRODUCT = "product",
  /** Certification/Training pages */
  CERTIFICATION = "certification",
  /** Category/Index pages */
  CATEGORY = "category",
  /** FAQ and informational pages */
  INFO = "info",
  /** About/Contact pages */
  TRUST = "trust",
  /** Legal/Policy pages */
  LEGAL = "legal",
  /** Low value or utility pages */
  UTILITY = "utility",
  /** Product variants (colors, sizes, etc.) */
  VARIANT = "variant",
  /** Unknown/Other */
  OTHER = "other",
}

/**
 * Pattern for matching URLs
 */
export interface UrlPattern {
  /** Pattern to match (can be string, regex, or function) */
  readonly match: string | RegExp | ((url: URL) => boolean);
  /** Priority if matched */
  readonly priority: PriorityLevel;
  /** Category if matched */
  readonly category: UrlCategory;
  /** Whether to include this in crawl */
  readonly include: boolean;
  /** Optional reason for exclusion */
  readonly reason?: string;
}

/**
 * Site-specific configuration
 */
export interface SiteConfig {
  /** Domain this config applies to */
  readonly domain: string;
  /** Patterns to check in order (first match wins) */
  readonly patterns: readonly UrlPattern[];
  /** Base URL for the site */
  readonly baseUrl: string;
}

/**
 * Result of site discovery
 */
export interface SiteDiscoveryResult {
  readonly totalUrls: number;
  readonly crawlableUrls: number;
  readonly skippedUrls: number;
  readonly byCategory: Readonly<Record<UrlCategory, number>>;
  readonly prioritizedUrls: readonly UrlFilterResult[];
}
