export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "fundamentals" | "audits" | "case-studies";
  content: string;
  score?: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-geo-vs-seo",
    title: "What is GEO/AEO vs SEO? The Key Differences for AI Engines",
    description:
      "Understand how Generative Engine Optimization (GEO/AEO) differs from traditional SEO and what you need to do to rank in AI search results.",
    date: "2026-01-15",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "how-ai-engines-choose-citations",
    title: "How AI Engines Choose Citations for Recommendations",
    description:
      "Learn the factors that determine which sources AI chatbots cite when answering user questions.",
    date: "2026-01-18",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "entity-clarity-checklist",
    title: "Entity Clarity Checklist for Better AI Rankings",
    description:
      "A practical checklist to ensure your brand entity is clear and consistent across the web for AI engines.",
    date: "2026-01-20",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "geo-audit-template",
    title: "GEO/AEO Audit Template (Free) - Complete Guide",
    description:
      "Download and use our free GEO/AEO audit template to assess your website's AI recommendation readiness.",
    date: "2026-01-22",
    category: "audits",
    content: "",
  },
  {
    slug: "direct-answer-block-examples",
    title: "Direct Answer Block Examples That Convert",
    description:
      "See real examples of direct answer blocks that help both users and AI engines understand your content quickly.",
    date: "2026-01-24",
    category: "audits",
    content: "",
  },
  {
    slug: "how-to-win-ai-citations",
    title: "How to Win AI Citations: The AEO Playbook for 2026",
    description:
      "Learn the proven strategies to get your brand cited by ChatGPT, Perplexity, Google AI Overviews, and other AI engines.",
    date: "2026-01-29",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "schema-markup-ai-citations-guide",
    title: "Schema Markup for AI Citations: Complete Guide",
    description:
      "Learn which schema types drive AI citations, how to implement JSON-LD structured data, and why FAQPage, HowTo, and Organization schemas matter for GEO.",
    date: "2026-01-30",
    category: "audits",
    content: "",
  },
  {
    slug: "ai-crawlers-robots-txt-guide",
    title: "AI Crawlers Explained: GPTBot, CCBot, and Robots.txt Configuration",
    description:
      "Understand AI crawlers like GPTBot, CCBot, Claude-Web, and Google-Extended. Learn how to configure robots.txt for GEO success.",
    date: "2026-01-30",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "google-ai-overviews-optimization",
    title: "How to Optimize for Google AI Overviews in 2026",
    description:
      "Learn the strategies to get featured in Google AI Overviews (formerly SGE). From content structure to E-E-A-T signals, master AI optimization.",
    date: "2026-01-31",
    category: "audits",
    content: "",
  },
  {
    slug: "direct-answer-blocks-guide",
    title: "Direct Answer Blocks: The Complete AEO Writing Guide",
    description:
      "Master the art of writing direct answer blocks that AI engines love. Learn structure, word count, and formatting for maximum citation potential.",
    date: "2026-01-31",
    category: "audits",
    content: "",
  },
  {
    slug: "entity-clarity-geo-guide",
    title: "Entity Clarity for GEO: Knowledge Graph Optimization",
    description:
      "Learn what entity clarity means for AI search, how to optimize for the knowledge graph, and why consistent entity signals drive citations.",
    date: "2026-02-01",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "measure-geo-success-metrics",
    title: "How to Measure GEO Success: Citation Tracking Metrics",
    description:
      "Discover the KPIs that matter for GEO: citation frequency, share of voice, brand visibility, and attribution quality. Track what counts.",
    date: "2026-02-01",
    category: "audits",
    content: "",
  },
  {
    slug: "chatgpt-perplexity-google-ai-citations",
    title: "ChatGPT vs Perplexity vs Google AI: Citation Differences Explained",
    description:
      "Each AI engine cites sources differently. Learn the platform-specific optimization tactics for ChatGPT, Perplexity, Google AI Overviews, and Claude.",
    date: "2026-02-02",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "eeat-ai-trust-signals",
    title: "E-E-A-T for AI: Building Trust Signals for GEO",
    description:
      "Learn how Experience, Expertise, Authoritativeness, and Trustworthiness impact AI citations. Build the trust signals AI engines look for.",
    date: "2026-02-02",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "zero-click-search-monetization",
    title: "Zero-Click Search: How to Win When No One Clicks",
    description:
      "AI search reduces clicks. Learn strategies to monetize brand visibility, build owned audiences, and thrive in the zero-click era.",
    date: "2026-02-03",
    category: "case-studies",
    content: "",
  },
  {
    slug: "geo-tools-software-2026",
    title: "GEO Tools and Software: Complete 2026 Guide",
    description:
      "Discover the best tools for GEO and AEO optimization in 2026. From schema validators to AI citation trackers, find the right software.",
    date: "2026-02-03",
    category: "audits",
    content: "",
  },
  {
    slug: "why-top-pages-win-ai-search",
    title: "Why Top Pages Win AI Search: 9 Shared Patterns",
    description:
      "Break down the common signals top-ranking GEO/AEO pages use: direct answers, entity clarity, structured data, and stronger trust proof.",
    date: "2026-02-05",
    category: "case-studies",
    content: "",
  },
  {
    slug: "top-questions-about-geo-aeo",
    title: "Top GEO/AEO Questions People Ask (And How to Answer Them)",
    description:
      "A practical list of high-intent GEO/AEO questions from current search demand with content angles you can publish this quarter.",
    date: "2026-02-06",
    category: "audits",
    content: "",
  },
  {
    slug: "page-with-redirect-google-search-console",
    title: "Page With Redirect in Google Search Console: Fix or Ignore?",
    description:
      "Understand when Search Console's 'Page with redirect' status is normal, when it signals a problem, and how to resolve true issues.",
    date: "2026-02-07",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "canonical-redirects-technical-seo-ai-search",
    title: "Canonical URLs + Redirects: Technical SEO Setup for AI Search",
    description:
      "Learn how canonical tags and permanent redirects work together to consolidate signals for Google, AI overviews, and answer engines.",
    date: "2026-02-08",
    category: "audits",
    content: "",
  },
  {
    slug: "chatgpt-search-crawling-guide",
    title: "How ChatGPT Search Crawls Websites and Chooses Sources",
    description:
      "A practical guide to crawler access, indexing behavior, and the content patterns that improve your odds of being cited in ChatGPT.",
    date: "2026-02-09",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "gptbot-vs-oai-searchbot",
    title: "GPTBot vs OAI-SearchBot: What Each Bot Means for Publishers",
    description:
      "Know the difference between OpenAI bots and what each one controls in robots.txt, from model training access to search visibility.",
    date: "2026-02-10",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "google-ai-overviews-ranking-signals",
    title: "Google AI Overviews Ranking Signals: What Matters Most",
    description:
      "Focus on the inputs most correlated with AI Overview inclusion: intent match, concise answers, source credibility, and page experience.",
    date: "2026-02-11",
    category: "audits",
    content: "",
  },
  {
    slug: "answer-engine-optimization-checklist-2026",
    title: "Answer Engine Optimization Checklist for 2026",
    description:
      "A deployment-ready AEO checklist covering technical setup, content structure, schema implementation, and measurement cadence.",
    date: "2026-02-12",
    category: "audits",
    content: "",
  },
  {
    slug: "topical-authority-for-ai-citations",
    title: "Topical Authority for AI Citations: Build a Cluster That Gets Cited",
    description:
      "Use query clusters and internal linking to help AI engines understand your expertise and cite your pages more consistently.",
    date: "2026-02-13",
    category: "case-studies",
    content: "",
  },
  {
    slug: "llms-txt-vs-robots-txt-guide",
    title: "llms.txt vs robots.txt: What Actually Helps AI Discovery?",
    description:
      "Separate signal from hype: where robots.txt matters today, where llms.txt can help readability, and where neither changes rankings.",
    date: "2026-02-14",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "best-content-formats-for-ai-citations",
    title: "Best Content Formats for AI Citations (With Examples)",
    description:
      "See which page formats are cited most often in AI answers and how to structure each format for extraction and attribution.",
    date: "2026-02-15",
    category: "audits",
    content: "",
  },
  {
    slug: "refresh-content-for-ai-overviews",
    title: "How Often to Refresh Content for AI Overviews and AEO",
    description:
      "Set a practical refresh cycle by query type so your pages stay current enough for AI answers without constant rewrites.",
    date: "2026-02-16",
    category: "case-studies",
    content: "",
  },
  {
    slug: "geo-vs-aeo-vs-seo-framework",
    title: "GEO vs AEO vs SEO: One Framework for Strategic Decisions",
    description:
      "Source-of-truth guide to how GEO, AEO, and SEO differ and work together with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-17",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "does-seo-still-matter-in-ai-search",
    title: "Does SEO Still Matter in AI Search?",
    description:
      "Source-of-truth guide to whether SEO still matters when AI answers reduce clicks with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-18",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "how-to-write-citable-definitions",
    title: "How to Write Citable Definitions for GEO/AEO",
    description:
      "Source-of-truth guide to how to write definitions that AI systems can cite safely with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-19",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "faq-strategy-for-aeo",
    title: "FAQ Strategy for AEO: Build an Answer Graph That Compounds",
    description:
      "Source-of-truth guide to how to design FAQ pages for answer engine optimization with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-20",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "howto-schema-for-answer-engines",
    title: "HowTo Schema for Answer Engines: When It Helps and When It Fails",
    description:
      "Source-of-truth guide to when HowTo schema improves AI answer visibility with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-21",
    category: "audits",
    score: 8,
    content: "",
  },
  {
    slug: "organization-schema-for-entity-clarity",
    title: "Organization Schema for Entity Clarity: Complete Implementation Guide",
    description:
      "Source-of-truth guide to how organization schema improves entity clarity with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-22",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "person-schema-for-authority",
    title: "Person Schema for Authority: Author Credibility in AI Search",
    description:
      "Source-of-truth guide to how person schema supports authority and trust signals with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-23",
    category: "fundamentals",
    score: 9,
    content: "",
  },
  {
    slug: "citation-tracking-dashboard-setup",
    title: "Citation Tracking Dashboard Setup: Metrics That Actually Matter",
    description:
      "Source-of-truth guide to how to build a practical citation tracking dashboard with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-24",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "ai-overviews-query-intent-map",
    title: "AI Overviews Query-Intent Map: Where You Should Compete First",
    description:
      "Source-of-truth guide to which query intents trigger AI overviews and where to prioritize with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-25",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "chatgpt-citation-optimization",
    title: "ChatGPT Citation Optimization: A Practical Editorial Model",
    description:
      "Source-of-truth guide to how to improve citation probability in ChatGPT experiences with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-26",
    category: "fundamentals",
    score: 8,
    content: "",
  },
  {
    slug: "perplexity-citation-optimization",
    title: "Perplexity Citation Optimization: Freshness + Community Signals",
    description:
      "Source-of-truth guide to how to optimize specifically for Perplexity citations with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-27",
    category: "fundamentals",
    score: 8,
    content: "",
  },
  {
    slug: "claude-citation-optimization",
    title: "Claude Citation Optimization: Nuance, Safety, and Source Quality",
    description:
      "Source-of-truth guide to how Claude-style responses select careful source material with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-02-28",
    category: "fundamentals",
    score: 8,
    content: "",
  },
  {
    slug: "copilot-citation-strategy",
    title: "Copilot Citation Strategy: Enterprise-Aware Content Positioning",
    description:
      "Source-of-truth guide to how to structure content for Microsoft Copilot-style retrieval with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-01",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "local-business-aeo-playbook",
    title: "Local Business AEO Playbook: GEO for Service-Area Companies",
    description:
      "Source-of-truth guide to how local businesses can appear in AI answers with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-02",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "ecommerce-product-pages-for-aeo",
    title: "Ecommerce Product Pages for AEO: Conversion-Ready Answer Blocks",
    description:
      "Source-of-truth guide to how ecommerce pages should change for answer engines with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-03",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "b2b-saas-aeo-content-engine",
    title: "B2B SaaS AEO Content Engine: From Problem Query to Demo Pipeline",
    description:
      "Source-of-truth guide to how B2B SaaS teams build repeatable AEO growth with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-04",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "healthcare-geo-compliance-guide",
    title: "Healthcare GEO Compliance Guide: Accuracy, Safety, and Trust",
    description:
      "Source-of-truth guide to how healthcare publishers balance GEO with compliance with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-05",
    category: "fundamentals",
    score: 9,
    content: "",
  },
  {
    slug: "legal-geo-accuracy-framework",
    title: "Legal GEO Accuracy Framework: Reducing Advice Risk in AI Search",
    description:
      "Source-of-truth guide to how legal sites stay accurate while optimizing for AI answers with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-06",
    category: "fundamentals",
    score: 9,
    content: "",
  },
  {
    slug: "finance-geo-risk-controls",
    title: "Finance GEO Risk Controls: Evidence Standards for YMYL Content",
    description:
      "Source-of-truth guide to how finance content teams reduce risk in AI-visible content with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-07",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "old-way-vs-new-way-seo-to-aeo",
    title: "Old Way vs New Way: Transitioning from SEO Tactics to AEO Systems",
    description:
      "Source-of-truth guide to how to shift from classic SEO output to AEO operating systems with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-08",
    category: "case-studies",
    score: 10,
    content: "",
  },
  {
    slug: "topic-cluster-blueprint-for-geo",
    title: "Topic Cluster Blueprint for GEO: The Citation-Centric Architecture",
    description:
      "Source-of-truth guide to how to build topic clusters that maximize citation opportunities with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-09",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "internal-linking-patterns-for-citations",
    title: "Internal Linking Patterns for Citations: What Actually Helps",
    description:
      "Source-of-truth guide to which internal linking patterns improve AI understanding with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-10",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "content-pruning-for-aeo",
    title: "Content Pruning for AEO: Remove Noise, Increase Authority Density",
    description:
      "Source-of-truth guide to how pruning thin pages affects GEO and citation outcomes with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-11",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "update-frequency-by-topic-volatility",
    title: "Update Frequency by Topic Volatility: AEO Refresh Policy",
    description:
      "Source-of-truth guide to how often different page types should be refreshed with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-12",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "no-click-search-conversion-model",
    title: "No-Click Search Conversion Model: Monetizing Visibility Without Visits",
    description:
      "Source-of-truth guide to how to monetize AI visibility when clicks decline with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-13",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "brand-mentions-vs-clicks-kpis",
    title: "Brand Mentions vs Clicks: KPI Stack for Zero-Click AI Search",
    description:
      "Source-of-truth guide to which KPIs replace click-first thinking in AEO with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-14",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "crawl-budget-for-large-content-sites",
    title: "Crawl Budget for Large Content Sites in the AI Era",
    description:
      "Source-of-truth guide to how crawl budget decisions impact large GEO content estates with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-15",
    category: "audits",
    score: 8,
    content: "",
  },
  {
    slug: "javascript-rendering-and-ai-discovery",
    title: "JavaScript Rendering and AI Discovery: Practical Mitigation Guide",
    description:
      "Source-of-truth guide to how JS rendering affects crawler and AI discoverability with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-16",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "canonicalization-at-scale-playbook",
    title: "Canonicalization at Scale Playbook: Prevent Signal Fragmentation",
    description:
      "Source-of-truth guide to how to run canonicalization reliably at scale with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-17",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "redirect-migration-without-traffic-loss",
    title: "Redirect Migration Without Traffic Loss: GEO-Safe Protocol",
    description:
      "Source-of-truth guide to how to execute URL migrations without citation signal loss with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-18",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "multilingual-geo-strategy",
    title: "Multilingual GEO Strategy: Language Coverage Without Cannibalization",
    description:
      "Source-of-truth guide to how to expand multilingual content for AI search with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-19",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "international-hreflang-for-ai-search",
    title: "International hreflang for AI Search: What Still Applies",
    description:
      "Source-of-truth guide to how hreflang interacts with AI-driven retrieval pathways with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-20",
    category: "audits",
    score: 8,
    content: "",
  },
  {
    slug: "llms-txt-implementation-guide",
    title: "llms.txt Implementation Guide: Supplemental, Not Substitute",
    description:
      "Source-of-truth guide to how to use llms.txt without weakening core SEO foundations with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-21",
    category: "fundamentals",
    score: 8,
    content: "",
  },
  {
    slug: "robots-txt-policy-for-ai-bots",
    title: "robots.txt Policy for AI Bots: Governance Model for Publishers",
    description:
      "Source-of-truth guide to how to govern robots policy decisions across teams with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-22",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "gsc-indexing-debug-framework",
    title: "Google Search Console Indexing Debug Framework for GEO Teams",
    description:
      "Source-of-truth guide to how to debug indexing and exclusion states systematically with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-23",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "entity-reconciliation-across-the-web",
    title: "Entity Reconciliation Across the Web: Fixing Identity Drift",
    description:
      "Source-of-truth guide to how to reconcile inconsistent entity signals across platforms with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-24",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "knowledge-panel-building-playbook",
    title: "Knowledge Panel Building Playbook: Signals You Can Control",
    description:
      "Source-of-truth guide to which actions increase likelihood of stronger knowledge graph representation with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-25",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "comparison-page-template-for-aeo",
    title: "Comparison Page Template for AEO: Neutral, Useful, and Citable",
    description:
      "Source-of-truth guide to how to build comparison pages that get cited with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-26",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "troubleshooting-content-template",
    title: "Troubleshooting Content Template for Answer Engines",
    description:
      "Source-of-truth guide to how to structure troubleshooting guides for AI retrieval with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-27",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "data-driven-content-for-ai-citations",
    title: "Data-Driven Content for AI Citations: Method > Opinion",
    description:
      "Source-of-truth guide to how original data content improves citation potential with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-28",
    category: "case-studies",
    score: 10,
    content: "",
  },
  {
    slug: "editorial-workflow-human-ai-teams",
    title: "Editorial Workflow for Human + AI Teams: Quality Control by Design",
    description:
      "Source-of-truth guide to how teams combine AI drafting with human editorial authority with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-29",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "fact-checking-workflow-for-aeo",
    title: "Fact-Checking Workflow for AEO: Source Discipline at Scale",
    description:
      "Source-of-truth guide to how to operationalize fact checking for high-volume AEO publishing with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-30",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "ai-content-quality-rubric",
    title: "AI Content Quality Rubric: A Practical 10-Point Review System",
    description:
      "Source-of-truth guide to how to score content quality before publishing in AI-search markets with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-03-31",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "aeo-pillar-page-template",
    title: "AEO Pillar Page Template: Build One Page Worth Citing",
    description:
      "Source-of-truth guide to how to design a pillar page as a source-of-truth asset with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-01",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "service-page-direct-answer-template",
    title: "Service Page Direct-Answer Template for GEO",
    description:
      "Source-of-truth guide to how to turn service pages into quote-ready answer assets with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-02",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "founder-led-thought-leadership-for-geo",
    title: "Founder-Led Thought Leadership for GEO: Experience as a Ranking Signal",
    description:
      "Source-of-truth guide to how founder expertise can strengthen GEO trust signals with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-03",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "community-content-for-perplexity",
    title: "Community Content for Perplexity: Where Discussion Becomes Discovery",
    description:
      "Source-of-truth guide to how community platforms influence Perplexity citation patterns with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-04",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "reddit-strategy-for-ai-visibility",
    title: "Reddit Strategy for AI Visibility: Participation Without Spam",
    description:
      "Source-of-truth guide to how Reddit activity can support AI visibility ethically with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-05",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "30-day-aeo-sprint-plan",
    title: "30-Day AEO Sprint Plan: From Audit to Publication",
    description:
      "Source-of-truth guide to how to execute an AEO sprint in 30 days with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-06",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "90-day-geo-roadmap",
    title: "90-Day GEO Roadmap: Build Durable Citation Equity",
    description:
      "Source-of-truth guide to how to sequence GEO work over a full quarter with definitions, evidence links, risks, and a practical implementation map.",
    date: "2026-04-07",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "why-chatgpt-vs-claude-perplexity-numbers-differ",
    title: "Why ChatGPT vs Claude/Perplexity Citation Numbers Differ",
    description:
      "Break down why citation counts vary by model, retrieval method, and product behavior instead of assuming one universal ranking system.",
    date: "2026-04-08",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "what-is-ssr-for-geo-citations",
    title: "What Is SSR for GEO? A Practical Guide for Founders",
    description:
      "A plain-language explanation of server-side rendering, why it helps discoverability, and when SSR alone is not enough for citations.",
    date: "2026-04-09",
    category: "fundamentals",
    score: 10,
    content: "",
  },
  {
    slug: "content-to-citation-strategy-without-backlinks",
    title: "Content-to-Citation Strategy Without Backlinks",
    description:
      "A step-by-step model to increase AI citations through page structure, evidence quality, and topical coherence even before link campaigns.",
    date: "2026-04-10",
    category: "case-studies",
    score: 10,
    content: "",
  },
  {
    slug: "distribution-vs-backlinks-2026-playbook",
    title: "Distribution vs Backlinks in 2026: The Operational Playbook",
    description:
      "Compare distribution channels and backlinks by effort, speed, and durability to choose the right mix for modern SEO + AEO.",
    date: "2026-04-11",
    category: "case-studies",
    score: 9,
    content: "",
  },
  {
    slug: "medium-crossposting-why-citations-stay-low",
    title: "Crossposting on Medium but Citations Stay Low? Here Is Why",
    description:
      "Diagnose why crossposting often fails to raise citations and what to change in canonicalization, structure, and evidence depth.",
    date: "2026-04-12",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "zero-backlinks-4k-citations-methodology",
    title: "4K Citations with Zero Backlinks: Methodology and Caveats",
    description:
      "A rigorous breakdown of what this claim can mean, how to test it honestly, and where survivorship bias distorts conclusions.",
    date: "2026-04-13",
    category: "case-studies",
    score: 10,
    content: "",
  },
  {
    slug: "brand-bias-free-geo-test-protocol",
    title: "Brand-Bias-Free GEO Test Protocol (So Results Are Credible)",
    description:
      "Design prompts and evaluations that remove brand-name bias so your GEO experiments reflect true competitive discoverability.",
    date: "2026-04-14",
    category: "audits",
    score: 10,
    content: "",
  },
  {
    slug: "reddit-digg-distribution-for-ai-citations",
    title: "Reddit + Digg Distribution for AI Citations: What Works Safely",
    description:
      "Use community distribution to accelerate discovery without turning your content operation into spam or short-term gaming.",
    date: "2026-04-15",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "snappy-ssr-website-checklist-for-geo",
    title: "Snappy SSR Website Checklist for GEO Teams",
    description:
      "A technical checklist for speed, render consistency, and crawlability so your site is easy to parse and easy to trust.",
    date: "2026-04-16",
    category: "audits",
    score: 9,
    content: "",
  },
  {
    slug: "agents-vs-manual-link-building-2026",
    title: "Agents vs Manual Link Building in 2026: False Choice or Real Shift?",
    description:
      "Compare automated query intelligence with traditional link outreach to decide where each method still creates edge.",
    date: "2026-04-17",
    category: "fundamentals",
    score: 8,
    content: "",
  },
  {
    slug: "accidental-ranking-vs-structured-content",
    title: "Accidental Ranking vs Structured Content Systems",
    description:
      "Why accidental wins are hard to repeat and how a structured editorial system creates durable search and citation performance.",
    date: "2026-04-18",
    category: "case-studies",
    score: 8,
    content: "",
  },
  {
    slug: "geo-thread-faq-from-real-operators",
    title: "GEO Thread FAQ from Real Operators: What Keeps Coming Up",
    description:
      "Real recurring questions from founders and SEOs about SSR, citations, distribution, and measurement answered in one source.",
    date: "2026-04-19",
    category: "fundamentals",
    score: 9,
    content: "",
  },
];
