/**
 * URL Filtering System
 *
 * Modular URL filtering and prioritization for SEO/AEO focused crawling.
 *
 * @example
 * ```ts
 * import { classifyUrl, filterUrls, getCrawlableUrls } from '@/lib/url';
 * import { countryfusionConfig } from '@/lib/url/sites/countryfusion';
 *
 * const results = filterUrls(urls, countryfusionConfig);
 * const crawlable = getCrawlableUrls(results, 50);
 * ```
 */

// Types
export type {
  PriorityLevel,
  SiteConfig,
  SiteDiscoveryResult,
  UrlCategory,
  UrlFilterResult,
  UrlPattern,
} from "./types";

// Filtering functions
export {
  classifyUrl,
  dedupeUrls,
  extractPathname,
  filterUrls,
  getCrawlableUrls,
  getPriorityScore,
  isHighPriority,
  isLowPriority,
  isMediumPriority,
  normalizeUrl,
} from "./filter";

// Site configs
export { countryfusionConfig, COUNTRYFUSION_PRIORITY_URLS } from "./sites/countryfusion";

// Default config (can be overridden per site)
export const DEFAULT_SITE_CONFIG = {
  domain: "example.com",
  baseUrl: "https://example.com",
  patterns: [
    // Homepage
    { match: /^\/?$/, priority: 1, category: "core" as const, include: true },

    // Core entity pages
    { match: "about", priority: 2, category: "trust" as const, include: true },
    { match: "contact", priority: 2, category: "trust" as const, include: true },

    // Service/Product pages
    { match: "service", priority: 3, category: "product" as const, include: true },
    { match: "product", priority: 3, category: "product" as const, include: true },
    { match: "pricing", priority: 3, category: "product" as const, include: true },

    // Trust and FAQ
    { match: "faq", priority: 4, category: "info" as const, include: true },
    { match: "testimonial", priority: 4, category: "trust" as const, include: true },
    { match: "review", priority: 4, category: "trust" as const, include: true },

    // Blog
    { match: "/blog", priority: 5, category: "category" as const, include: true },
    { match: "/blog/", priority: 6, category: "blog" as const, include: true },

    // Skip low-value
    { match: "privacy", priority: 10, category: "legal" as const, include: false, reason: "Legal page" },
    { match: "terms", priority: 10, category: "legal" as const, include: false, reason: "Legal page" },
    { match: "cookie", priority: 10, category: "legal" as const, include: false, reason: "Legal page" },
  ] as const,
} as const;
