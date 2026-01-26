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
    date: "2025-01-15",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "how-ai-engines-choose-citations",
    title: "How AI Engines Choose Citations for Recommendations",
    description:
      "Learn the factors that determine which sources AI chatbots cite when answering user questions.",
    date: "2025-01-18",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "entity-clarity-checklist",
    title: "Entity Clarity Checklist for Better AI Rankings",
    description:
      "A practical checklist to ensure your brand entity is clear and consistent across the web for AI engines.",
    date: "2025-01-20",
    category: "fundamentals",
    content: "",
  },
  {
    slug: "geo-audit-template",
    title: "GEO Audit Template (Free) - Complete Guide",
    description:
      "Download and use our free GEO audit template to assess your website's AI recommendation readiness.",
    date: "2025-01-22",
    category: "audits",
    content: "",
  },
  {
    slug: "direct-answer-block-examples",
    title: "Direct Answer Block Examples That Convert",
    description:
      "See real examples of direct answer blocks that help both users and AI engines understand your content quickly.",
    date: "2025-01-24",
    category: "audits",
    content: "",
  },
];
