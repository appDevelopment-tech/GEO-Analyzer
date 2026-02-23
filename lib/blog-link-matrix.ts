import type { BlogPost } from "@/lib/blog-data";

const INTERNAL_LINK_CLUSTERS: string[][] = [
  [
    "geo-vs-aeo-vs-seo-framework",
    "does-seo-still-matter-in-ai-search",
    "old-way-vs-new-way-seo-to-aeo",
    "answer-engine-optimization-checklist-2026",
    "what-is-geo-vs-seo",
  ],
  [
    "how-to-write-citable-definitions",
    "faq-strategy-for-aeo",
    "direct-answer-blocks-guide",
    "direct-answer-block-examples",
    "aeo-pillar-page-template",
    "service-page-direct-answer-template",
    "how-ai-engines-choose-citations",
  ],
  [
    "organization-schema-for-entity-clarity",
    "person-schema-for-authority",
    "schema-markup-ai-citations-guide",
    "entity-clarity-geo-guide",
    "entity-reconciliation-across-the-web",
    "knowledge-panel-building-playbook",
    "entity-clarity-checklist",
  ],
  [
    "robots-txt-policy-for-ai-bots",
    "gptbot-vs-oai-searchbot",
    "ai-crawlers-robots-txt-guide",
    "chatgpt-search-crawling-guide",
    "llms-txt-implementation-guide",
    "llms-txt-vs-robots-txt-guide",
    "javascript-rendering-and-ai-discovery",
    "crawl-budget-for-large-content-sites",
  ],
  [
    "canonicalization-at-scale-playbook",
    "canonical-redirects-technical-seo-ai-search",
    "redirect-migration-without-traffic-loss",
    "gsc-indexing-debug-framework",
    "page-with-redirect-google-search-console",
  ],
  [
    "chatgpt-citation-optimization",
    "perplexity-citation-optimization",
    "claude-citation-optimization",
    "copilot-citation-strategy",
    "chatgpt-perplexity-google-ai-citations",
    "google-ai-overviews-ranking-signals",
    "google-ai-overviews-optimization",
    "community-content-for-perplexity",
    "reddit-strategy-for-ai-visibility",
    "ai-overviews-query-intent-map",
  ],
  [
    "topic-cluster-blueprint-for-geo",
    "internal-linking-patterns-for-citations",
    "comparison-page-template-for-aeo",
    "troubleshooting-content-template",
    "best-content-formats-for-ai-citations",
    "topical-authority-for-ai-citations",
    "content-pruning-for-aeo",
    "update-frequency-by-topic-volatility",
    "refresh-content-for-ai-overviews",
  ],
  [
    "citation-tracking-dashboard-setup",
    "measure-geo-success-metrics",
    "brand-mentions-vs-clicks-kpis",
    "no-click-search-conversion-model",
    "zero-click-search-monetization",
    "geo-tools-software-2026",
  ],
  [
    "local-business-aeo-playbook",
    "ecommerce-product-pages-for-aeo",
    "b2b-saas-aeo-content-engine",
    "healthcare-geo-compliance-guide",
    "legal-geo-accuracy-framework",
    "finance-geo-risk-controls",
    "eeat-ai-trust-signals",
  ],
  [
    "editorial-workflow-human-ai-teams",
    "fact-checking-workflow-for-aeo",
    "ai-content-quality-rubric",
    "data-driven-content-for-ai-citations",
    "30-day-aeo-sprint-plan",
    "90-day-geo-roadmap",
    "founder-led-thought-leadership-for-geo",
    "how-to-win-ai-citations",
  ],
];

export function getInternalLinkTargets(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 4,
): BlogPost[] {
  const postBySlug = new Map(allPosts.map((post) => [post.slug, post]));
  const candidateSlugs: string[] = [];

  const relevantClusters = INTERNAL_LINK_CLUSTERS.filter((cluster) =>
    cluster.includes(currentPost.slug),
  );

  relevantClusters.forEach((cluster) => {
    cluster.forEach((slug) => {
      if (slug !== currentPost.slug) {
        candidateSlugs.push(slug);
      }
    });
  });

  const sameCategorySlugs = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && post.category === currentPost.category,
    )
    .sort((a, b) => {
      const scoreDelta = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDelta !== 0) return scoreDelta;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((post) => post.slug);

  candidateSlugs.push(...sameCategorySlugs);

  const globalFallbackSlugs = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .sort((a, b) => {
      const scoreDelta = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDelta !== 0) return scoreDelta;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((post) => post.slug);

  candidateSlugs.push(...globalFallbackSlugs);

  const uniqueSlugs: string[] = [];
  candidateSlugs.forEach((slug) => {
    if (!uniqueSlugs.includes(slug)) {
      uniqueSlugs.push(slug);
    }
  });

  return uniqueSlugs
    .map((slug) => postBySlug.get(slug))
    .filter((post): post is BlogPost => Boolean(post))
    .slice(0, limit);
}
