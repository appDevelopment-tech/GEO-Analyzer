/**
 * CountryFusion.net Site Configuration
 *
 * Priority rules and URL patterns for countryfusion.net
 *
 * SEO/AEO Focus:
 * - Blog posts targeting Nashville + dance keywords
 * - Certification pages (high conversion intent)
 * - Core service pages (bachelorette, classes, etc.)
 * - Skip product variants and low-value pages
 */

import type { SiteConfig } from "../types";
import { UrlCategory } from "../types";

const { CORE, BLOG, PRODUCT, CERTIFICATION, CATEGORY, INFO, TRUST, LEGAL, UTILITY, VARIANT } = UrlCategory;

/**
 * Patterns checked in order (first match wins)
 * Higher priority numbers = lower priority
 */
const PATTERNS = [
  // === PRIORITY 1: Homepage ===
  {
    match: /^\/?$/,
    priority: 1,
    category: CORE,
    include: true,
  },

  // === PRIORITY 2: Core Certification Landing ===
  { match: "/certification", priority: 2, category: CERTIFICATION, include: true },
  { match: "/instructor-certification", priority: 2, category: CERTIFICATION, include: true },

  // === PRIORITY 3: High-Value Certification Pages ===
  { match: "/online-instructor-certification", priority: 3, category: CERTIFICATION, include: true },
  { match: "/aquatic-instructor-certification", priority: 3, category: CERTIFICATION, include: true },
  { match: "/online-kids-instructor-certification", priority: 3, category: CERTIFICATION, include: true },
  { match: "/two-step-certification", priority: 3, category: CERTIFICATION, include: true },
  { match: "/strut-instructor-certification", priority: 3, category: CERTIFICATION, include: true },

  // === PRIORITY 3: Core Service Pages ===
  { match: "/what-is-country-fusion", priority: 3, category: INFO, include: true },
  { match: "/country-fusion-faq", priority: 3, category: INFO, include: true },
  { match: "/country-fusion-for-kids", priority: 3, category: INFO, include: true },
  { match: "/lifestyle", priority: 3, category: INFO, include: true },
  { match: "/nashville-headquarters", priority: 3, category: TRUST, include: true },
  { match: "/classes", priority: 3, category: CORE, include: true },
  { match: "/events", priority: 3, category: INFO, include: true },
  { match: "/testimonials", priority: 3, category: TRUST, include: true },
  { match: "/bachelorette-parties", priority: 3, category: CORE, include: true },
  { match: "/wedding", priority: 3, category: CORE, include: true },

  // === PRIORITY 4: Live Trainings & Exam ===
  { match: "/live-trainings", priority: 4, category: CERTIFICATION, include: true },
  { match: "/certification-exam", priority: 4, category: CERTIFICATION, include: true },
  { match: "/strut-certification-exam", priority: 4, category: CERTIFICATION, include: true },
  { match: "/two-step-certification-exam", priority: 4, category: CERTIFICATION, include: true },
  { match: "/aqua-fusion-certification-exam", priority: 4, category: CERTIFICATION, include: true },
  { match: "/kids-certification-exam", priority: 4, category: CERTIFICATION, include: true },

  // === PRIORITY 4: Nashville/Location Blog Posts (high SEO value) ===
  { match: "/best-dance-studios-in-nashville", priority: 4, category: BLOG, include: true },
  { match: "/the-ultimate-bachelorette-party-experience-in-nashville", priority: 4, category: BLOG, include: true },
  {
    match: /turn-your-passion-for-dance-into-career.*nashville/,
    priority: 4,
    category: BLOG,
    include: true,
  },
  { match: "/cma-fest-2025-in-nashville", priority: 4, category: BLOG, include: true },
  { match: "/top-things-to-do-in-nashville", priority: 4, category: BLOG, include: true },
  { match: "/where-to-take-two-step-dance-lessons-in-nashville", priority: 4, category: BLOG, include: true },

  // === PRIORITY 5: Other High-Value Blog Posts ===
  { match: "/new-two-step-certification", priority: 5, category: BLOG, include: true },
  {
    match: "/make-a-splash-get-certified-as-a-country-fusion-aquatics-instructor",
    priority: 5,
    category: BLOG,
    include: true,
  },
  { match: "/from-new-york-to-nashville-elizabeth-mooneys-country-fusion-journey", priority: 5, category: BLOG, include: true },
  { match: "/step-into-success-mastering-line-dance-fitness-instruction", priority: 5, category: BLOG, include: true },
  { match: "/begin-your-line-dancing-journey", priority: 5, category: BLOG, include: true },
  { match: "/get-your-boots-tapping-a-beginners-guide-to-country-swing-dancing", priority: 5, category: BLOG, include: true },
  { match: "/country-line-dancing-for-fitness", priority: 5, category: BLOG, include: true },
  { match: "/who-is-dance-therapy-for", priority: 5, category: BLOG, include: true },
  { match: "/why-bachelorette-pole-dance-parties-are-the-ultimate-girls-night-out", priority: 5, category: BLOG, include: true },
  { match: "/bachelorette-line-dancing", priority: 5, category: BLOG, include: true },
  { match: "/why-bachelorettes-love-countryfusion", priority: 5, category: BLOG, include: true },
  { match: "/become-a-certified-country-fusion-instructor", priority: 5, category: BLOG, include: true },

  // === PRIORITY 6: Product Categories (navigation only) ===
  { match: "/product-category/apparel", priority: 6, category: CATEGORY, include: true },
  { match: "/product-category/certifications", priority: 6, category: CATEGORY, include: true },
  { match: "/product-category/classes", priority: 6, category: CATEGORY, include: true },
  { match: "/product-category/subscriptions", priority: 6, category: CATEGORY, include: true },
  { match: "/product-category/instructor-subscriptions", priority: 6, category: CATEGORY, include: true },

  // === PRIORITY 7: Key Individual Product Pages (main products only) ===
  { match: "/product/online-instructor-certification", priority: 7, category: PRODUCT, include: true },
  { match: "/product/instructor-certification-bundle", priority: 7, category: PRODUCT, include: true },
  { match: "/product/two-step-and-country-swing-instructor-certification", priority: 7, category: PRODUCT, include: true },
  { match: "/product/aquatics-instructor-certification", priority: 7, category: PRODUCT, include: true },
  { match: "/product/kids-instructor-certification", priority: 7, category: PRODUCT, include: true },
  { match: "/product/instructor-all-access-membership", priority: 7, category: PRODUCT, include: true },
  { match: "/product/line-dance-fitness-tutorials-subscription", priority: 7, category: PRODUCT, include: true },
  { match: "/product/country-fusion", priority: 7, category: PRODUCT, include: true },

  // === SKIP: Product Variants (colors, sizes) ===
  {
    match: /product.*(tank|hoodie|sweatshirt|sweatpants|flannel|hat|cap|mask|bandana|jacket|crop)/,
    priority: 10,
    category: VARIANT,
    include: false,
    reason: "Product variant (color/size)",
  },
  {
    match: /product.*(gray|black|pink|peach|white|green|yellow|camo|blue|red|purple|logo)/i,
    priority: 10,
    category: VARIANT,
    include: false,
    reason: "Product variant (color)",
  },
  {
    match: /product.*(freedom|honky-tonk|outlaw|line-dance-queen)/i,
    priority: 10,
    category: VARIANT,
    include: false,
    reason: "Product variant (style)",
  },

  // === SKIP: Low-value product pages ===
  { match: "/product/pt5", priority: 10, category: PRODUCT, include: false, reason: "Low value product" },
  { match: "/product/single-class", priority: 10, category: PRODUCT, include: false, reason: "Single class product" },
  { match: "/product/single-session-booking", priority: 10, category: PRODUCT, include: false, reason: "Single session" },
  { match: "/product/single-zoom-class", priority: 10, category: PRODUCT, include: false, reason: "Single zoom class" },

  // === SKIP: Member/restricted pages ===
  {
    match: "/instructor-video-access",
    priority: 10,
    category: UTILITY,
    include: false,
    reason: "Member-only content",
  },
  {
    match: "/membership-kids-instructor-video-access",
    priority: 10,
    category: UTILITY,
    include: false,
    reason: "Member-only content",
  },
  { match: "/line-dance-tutorials", priority: 10, category: UTILITY, include: false, reason: "Member-only content" },
  { match: "/content-restricted", priority: 10, category: UTILITY, include: false, reason: "Restricted content" },
  { match: "/under-construction", priority: 10, category: UTILITY, include: false, reason: "Under construction" },
  { match: "/its-a-pool-party", priority: 10, category: UTILITY, include: false, reason: "Redirect/low value" },

  // === SKIP: Legal/Utility ===
  { match: "/refund-policy", priority: 10, category: LEGAL, include: false, reason: "Legal page" },
  { match: "/dvds", priority: 10, category: UTILITY, include: false, reason: "Outdated content" },

  // === SKIP: Duplicate trailing slash ===
  {
    match: (url: URL) => url.pathname.endsWith("/") && url.pathname.length > 1,
    priority: 10,
    category: UTILITY,
    include: false,
    reason: "Duplicate trailing slash",
  },
] as const;

/**
 * CountryFusion.net site configuration
 */
export const countryfusionConfig: SiteConfig = {
  domain: "countryfusion.net",
  baseUrl: "https://countryfusion.net",
  patterns: PATTERNS,
};

/**
 * Manually curated list of priority URLs for CountryFusion
 * Use this for automated crawling or manual verification
 */
export const COUNTRYFUSION_PRIORITY_URLS = [
  // Core
  "https://countryfusion.net/",

  // Certifications
  "https://countryfusion.net/certification",
  "https://countryfusion.net/instructor-certification",
  "https://countryfusion.net/online-instructor-certification",
  "https://countryfusion.net/aquatic-instructor-certification",
  "https://countryfusion.net/online-kids-instructor-certification",
  "https://countryfusion.net/two-step-certification",
  "https://countryfusion.net/strut-instructor-certification",
  "https://countryfusion.net/live-trainings",
  "https://countryfusion.net/certification-exam",

  // Core Pages
  "https://countryfusion.net/what-is-country-fusion",
  "https://countryfusion.net/country-fusion-faq",
  "https://countryfusion.net/country-fusion-for-kids",
  "https://countryfusion.net/lifestyle",
  "https://countryfusion.net/nashville-headquarters",
  "https://countryfusion.net/classes",
  "https://countryfusion.net/events",
  "https://countryfusion.net/testimonials",
  "https://countryfusion.net/bachelorette-parties",
  "https://countryfusion.net/wedding",

  // Nashville/Location Blog Posts
  "https://countryfusion.net/best-dance-studios-in-nashville",
  "https://countryfusion.net/the-ultimate-bachelorette-party-experience-in-nashville",
  "https://countryfusion.net/turn-your-passion-for-dance-into-career-become-a-certified-line-dance-instructor-in-nashville",
  "https://countryfusion.net/cma-fest-2025-in-nashville-celebrate-country-music-line-dancing",
  "https://countryfusion.net/top-things-to-do-in-nashville",
  "https://countryfusion.net/where-to-take-two-step-dance-lessons-in-nashville",

  // Other Blog Posts
  "https://countryfusion.net/new-two-step-certification",
  "https://countryfusion.net/make-a-splash-get-certified-as-a-country-fusion-aquatics-instructor",
  "https://countryfusion.net/from-new-york-to-nashville-elizabeth-mooneys-country-fusion-journey",
  "https://countryfusion.net/step-into-success-mastering-line-dance-fitness-instruction",
  "https://countryfusion.net/begin-your-line-dancing-journey",
  "https://countryfusion.net/get-your-boots-tapping-a-beginners-guide-to-country-swing-dancing",
  "https://countryfusion.net/country-line-dancing-for-fitness",
  "https://countryfusion.net/who-is-dance-therapy-for",
  "https://countryfusion.net/why-bachelorette-pole-dance-parties-are-the-ultimate-girls-night-out",
  "https://countryfusion.net/bachelorette-line-dancing",
  "https://countryfusion.net/why-bachelorettes-love-countryfusion",
  "https://countryfusion.net/become-a-certified-country-fusion-instructor",

  // Product Categories
  "https://countryfusion.net/product-category/apparel",
  "https://countryfusion.net/product-category/certifications",
  "https://countryfusion.net/product-category/classes",
  "https://countryfusion.net/product-category/subscriptions",
  "https://countryfusion.net/product-category/instructor-subscriptions",

  // Key Products
  "https://countryfusion.net/product/online-instructor-certification",
  "https://countryfusion.net/product/instructor-certification-bundle",
  "https://countryfusion.net/product/two-step-and-country-swing-instructor-certification",
  "https://countryfusion.net/product/aquatics-instructor-certification",
  "https://countryfusion.net/product/kids-instructor-certification",
  "https://countryfusion.net/product/instructor-all-access-membership",
  "https://countryfusion.net/product/line-dance-fitness-tutorials-subscription",
  "https://countryfusion.net/product/country-fusion",
] as const;

export default countryfusionConfig;
