export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "fundamentals" | "audits" | "case-studies";
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-geo-vs-seo",
    title: "What is GEO vs SEO? The Key Differences for AI Engines",
    description:
      "Understand how Generative Engine Optimization (GEO) differs from traditional SEO and what you need to do to rank in AI search results.",
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
    title: "GEO Audit Template (Free) - Complete Guide",
    description:
      "Download and use our free GEO audit template to assess your website's AI recommendation readiness.",
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
];
