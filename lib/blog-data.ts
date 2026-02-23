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
];
