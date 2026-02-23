import type { BlogPost } from "@/lib/blog-data";

export interface ComparisonRow {
  criterion: string;
  optionA: string;
  optionB: string;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export interface ComparisonPage {
  slug: string;
  title: string;
  description: string;
  date: string;
  optionAName: string;
  optionBName: string;
  directAnswer: string;
  tension: string;
  rows: ComparisonRow[];
  primaryAction: string;
  secondaryActions: string[];
  executionPlan: string[];
  limitation: string;
  faqs: ComparisonFaq[];
  tags: string[];
}

export const comparisonPages: ComparisonPage[] = [
  {
    slug: "geo-vs-seo-priority",
    title: "GEO vs SEO: Which Should You Prioritize First in 2026?",
    description:
      "Direct comparison for teams deciding where to invest first: traditional search rankings or AI citation visibility.",
    date: "2026-02-23",
    optionAName: "SEO-First",
    optionBName: "GEO-First",
    directAnswer:
      "If your pipeline depends on legacy Google rankings, start SEO-first and layer GEO into existing winners. If your category is moving to AI assistants and recommendation answers, GEO-first usually compounds faster. The best path is staged: preserve ranking traffic while building one source-of-truth citation cluster in parallel.",
    tension:
      "Teams assume they must pick one lane. In practice, performance drops when SEO and GEO are isolated because ranking pages often become the best seed assets for citation systems.",
    rows: [
      {
        criterion: "Fastest short-term traffic",
        optionA: "Stronger for legacy SERP traffic capture",
        optionB: "Stronger for assistant mention growth",
      },
      {
        criterion: "Content format preference",
        optionA: "Keyword/topic pages and search intent coverage",
        optionB: "Direct answers, FAQs, and source-of-truth pages",
      },
      {
        criterion: "Measurement model",
        optionA: "Rankings, impressions, organic clicks",
        optionB: "Citation frequency, share of voice, brand mention quality",
      },
      {
        criterion: "Dependency risk",
        optionA: "Higher dependence on SERP algorithm shifts",
        optionB: "Higher dependence on model retrieval behavior",
      },
    ],
    primaryAction:
      "Map your top 20 SEO pages and convert 3 into source-of-truth GEO pages this month.",
    secondaryActions: [
      "Add direct-answer blocks and FAQ schema to pages already ranking.",
      "Create one citation tracking sheet across ChatGPT, Claude, and Perplexity.",
      "Consolidate duplicate URLs so authority points to one canonical document.",
    ],
    executionPlan: [
      "Days 1-7: baseline SEO and citation metrics on current pages.",
      "Days 8-14: rewrite top pages with direct answers and tighter structure.",
      "Days 15-30: test prompts weekly and expand what gets cited consistently.",
    ],
    limitation:
      "Pure GEO-first often fails when technical SEO basics are broken; crawlers still need stable indexing and canonical control.",
    faqs: [
      {
        question: "What is the main difference between GEO and SEO?",
        answer:
          "SEO optimizes for ranking in search results, while GEO optimizes for being cited inside AI-generated answers.",
      },
      {
        question: "Can GEO replace SEO entirely?",
        answer:
          "Not yet. Most teams still need SEO for baseline acquisition while GEO grows citation visibility.",
      },
      {
        question: "How should startups prioritize?",
        answer:
          "Startups with limited resources should keep technical SEO healthy and build one high-quality GEO cluster first.",
      },
    ],
    tags: ["geo", "seo", "citations", "strategy", "ranking"],
  },
  {
    slug: "ssr-vs-csr-for-ai-crawlers",
    title: "SSR vs CSR for AI Crawlers: What Actually Gets Cited",
    description:
      "Compare server-side rendering and client-side rendering for AI crawler visibility and citation reliability.",
    date: "2026-02-23",
    optionAName: "SSR / Static Rendering",
    optionBName: "CSR / Heavy JS Rendering",
    directAnswer:
      "SSR and static rendering generally produce more reliable AI citations because crawlers can parse complete content without executing complex JavaScript. CSR can work, but only when hydration is fast and critical answers are server-rendered. If citation reliability matters, render primary answers server-side first and hydrate enhancements later.",
    tension:
      "Teams optimize for frontend flexibility, then lose citations because crawlers see empty shells or delayed content.",
    rows: [
      {
        criterion: "Crawler readability",
        optionA: "High: content available in initial HTML",
        optionB: "Variable: depends on JS execution quality",
      },
      {
        criterion: "Citation consistency",
        optionA: "Usually stable across engines",
        optionB: "Often inconsistent by crawler",
      },
      {
        criterion: "Engineering complexity",
        optionA: "Moderate, predictable for content pages",
        optionB: "Higher debugging overhead for crawlability",
      },
      {
        criterion: "Time-to-first-content",
        optionA: "Fast for text-heavy pages",
        optionB: "Can be delayed by bundles and scripts",
      },
    ],
    primaryAction:
      "Server-render your direct-answer blocks, FAQ content, and key comparison tables on every strategic page.",
    secondaryActions: [
      "Verify rendered HTML includes the full answer text before JavaScript executes.",
      "Monitor logs for GPTBot, OAI-SearchBot, and PerplexityBot crawl success.",
      "Remove JS-only gates on informational pages.",
    ],
    executionPlan: [
      "Days 1-7: audit rendering mode by page template.",
      "Days 8-14: migrate top citation pages to SSR/static.",
      "Days 15-30: compare citation frequency before and after migration.",
    ],
    limitation:
      "SSR alone does not guarantee citations; weak entity signals and unsourced claims still underperform.",
    faqs: [
      {
        question: "Do AI crawlers execute JavaScript?",
        answer:
          "Some do to varying degrees, but relying on JS execution increases risk and inconsistency.",
      },
      {
        question: "Is static generation better than SSR?",
        answer:
          "For stable educational content, static is often best. For frequently updated content, SSR can be more practical.",
      },
      {
        question: "What should stay client-rendered?",
        answer:
          "Interactive UI can stay client-side, but core answers and structured content should be rendered server-side.",
      },
    ],
    tags: ["ssr", "csr", "technical", "crawlers", "rendering"],
  },
  {
    slug: "backlinks-vs-distribution-for-citations",
    title: "Backlinks vs Distribution: Which Drives AI Citations Faster?",
    description:
      "A practical comparison of classical link-building versus distribution-first content systems for AI visibility.",
    date: "2026-02-23",
    optionAName: "Backlink-First",
    optionBName: "Distribution-First",
    directAnswer:
      "Backlinks still matter for trust, but distribution-first often drives faster citation discovery in AI systems because it creates fresh, cross-surface mentions and retrieval opportunities. The strongest model combines both: distribute high-quality source pages early, then compound with selective authority links instead of volume link campaigns.",
    tension:
      "Marketers treat backlinks as the only authority lever, while AI citation systems increasingly reward content discoverability and answer structure.",
    rows: [
      {
        criterion: "Speed of observable impact",
        optionA: "Usually slower, relationship dependent",
        optionB: "Often faster with consistent publishing/distribution",
      },
      {
        criterion: "Cost profile",
        optionA: "High outreach and negotiation costs",
        optionB: "Higher editorial/process cost, lower outreach cost",
      },
      {
        criterion: "Durability",
        optionA: "Strong when links are authoritative and stable",
        optionB: "Strong when distribution loop is repeatable",
      },
      {
        criterion: "Failure mode",
        optionA: "Low link quality and diminishing returns",
        optionB: "High volume with weak source pages",
      },
    ],
    primaryAction:
      "Build a weekly distribution engine for your top source-of-truth pages before scaling link outreach.",
    secondaryActions: [
      "Repurpose each source page into 3 platform-native summaries.",
      "Track citation pickup by topic and source freshness.",
      "Acquire fewer but higher-quality links to your canonical pages.",
    ],
    executionPlan: [
      "Days 1-7: choose 5 core pages and define distribution cadence.",
      "Days 8-14: publish and distribute with stable canonical URLs.",
      "Days 15-30: compare citation gains against link-only campaigns.",
    ],
    limitation:
      "Distribution without real evidence and specificity can inflate impressions but fail citation conversion.",
    faqs: [
      {
        question: "Are backlinks still important in 2026?",
        answer:
          "Yes, but they are one trust signal among several and no longer a standalone growth strategy for AI visibility.",
      },
      {
        question: "What distribution channels matter most?",
        answer:
          "Channels where target audiences discuss and reference sources, such as niche communities and platform-native posts.",
      },
      {
        question: "How many backlinks are enough?",
        answer:
          "There is no fixed number; quality, topical fit, and destination page quality matter more than volume.",
      },
    ],
    tags: ["backlinks", "distribution", "authority", "citations", "strategy"],
  },
  {
    slug: "schema-first-vs-content-first-geo",
    title: "Schema-First vs Content-First GEO: What to Fix First?",
    description:
      "A decision framework for whether your next GEO sprint should prioritize structured data or source page quality.",
    date: "2026-02-23",
    optionAName: "Schema-First",
    optionBName: "Content-First",
    directAnswer:
      "If your content already answers real questions clearly, schema-first can unlock faster extraction. If your pages are vague, schema won’t save them. In most cases, content-first on one canonical page plus minimal required schema is the safest sequence. Add advanced schema only after the answer quality is undeniable.",
    tension:
      "Teams often ship perfect schema on weak pages and wonder why citations do not move.",
    rows: [
      {
        criterion: "Immediate implementation speed",
        optionA: "Fast for technical teams",
        optionB: "Moderate due to editorial cycles",
      },
      {
        criterion: "Impact when page quality is low",
        optionA: "Limited",
        optionB: "High",
      },
      {
        criterion: "Impact when page quality is high",
        optionA: "High multiplier",
        optionB: "Still strong, but less technical leverage",
      },
      {
        criterion: "Typical mistake",
        optionA: "Markup correctness without useful answers",
        optionB: "Useful answers with no machine-readable context",
      },
    ],
    primaryAction:
      "Pick one revenue-critical page and improve direct answer quality before adding advanced schema blocks.",
    secondaryActions: [
      "Implement Organization, Article, and FAQPage schema on the upgraded page.",
      "Validate markup and content alignment after every edit.",
      "Track citation quality, not only appearance count.",
    ],
    executionPlan: [
      "Days 1-7: rewrite the answer and add evidence links.",
      "Days 8-14: add and validate schema for that page.",
      "Days 15-30: replicate to adjacent topic pages.",
    ],
    limitation:
      "Content-first can be slow without clear editorial standards; schema-first can create false confidence.",
    faqs: [
      {
        question: "Can schema alone improve citations?",
        answer:
          "It can help extraction, but it rarely compensates for weak or generic page content.",
      },
      {
        question: "Which schema types are required first?",
        answer:
          "Start with Organization and Article, then FAQPage where relevant and accurate.",
      },
      {
        question: "Should I add every schema type available?",
        answer:
          "No. Add only schema that truthfully represents visible page content.",
      },
    ],
    tags: ["schema", "content", "technical", "faq", "article"],
  },
  {
    slug: "long-form-vs-direct-answer-pages",
    title: "Long-Form Guides vs Direct-Answer Pages for AEO",
    description:
      "When deep evergreen guides beat concise answer pages, and when the opposite is true for citations.",
    date: "2026-02-23",
    optionAName: "Long-Form Guide",
    optionBName: "Direct-Answer Page",
    directAnswer:
      "Direct-answer pages usually win initial citation selection because models can extract them quickly. Long-form guides win when they are structured with clear definitions, evidence, and modular sections. The highest-performing pattern combines both: concise answer at the top, depth below, and linked support articles around the same topic cluster.",
    tension:
      "Teams choose either short or long formats, but AI systems reward structured depth, not word count extremes.",
    rows: [
      {
        criterion: "Snippet readiness",
        optionA: "Medium unless tightly structured",
        optionB: "High",
      },
      {
        criterion: "Depth and objection handling",
        optionA: "High",
        optionB: "Lower unless linked to support pages",
      },
      {
        criterion: "Editorial effort",
        optionA: "High",
        optionB: "Medium",
      },
      {
        criterion: "Best use case",
        optionA: "Complex strategic topics",
        optionB: "Specific transactional or definitional queries",
      },
    ],
    primaryAction:
      "Refactor long-form pages so the first 60 words answer the query directly, then keep depth underneath.",
    secondaryActions: [
      "Add section-level summaries and comparison tables to long guides.",
      "Link short answer pages to one authoritative long-form source.",
      "Remove repetitive filler paragraphs.",
    ],
    executionPlan: [
      "Days 1-7: identify pages with high depth and low citation pickup.",
      "Days 8-14: insert direct-answer lead blocks and FAQ sections.",
      "Days 15-30: compare citation changes by page format.",
    ],
    limitation:
      "Short pages without proof are easy to extract but easy to distrust; depth still matters.",
    faqs: [
      {
        question: "What is the ideal word count for GEO pages?",
        answer:
          "There is no fixed number; clarity and structure matter more than length.",
      },
      {
        question: "Should I split every long article?",
        answer:
          "Only when one page tries to solve multiple intents that deserve separate canonical answers.",
      },
      {
        question: "How do I keep long content citable?",
        answer:
          "Place concise answers early, use clear headings, and include evidence where claims are made.",
      },
    ],
    tags: ["content", "direct-answer", "long-form", "aeo", "format"],
  },
  {
    slug: "ai-drafting-vs-human-editorial-control",
    title: "AI Drafting vs Human Editorial Control: Which Wins Citations?",
    description:
      "A practical decision model for blending AI speed with human authority in citation-focused content systems.",
    date: "2026-02-23",
    optionAName: "AI-Drafting Heavy",
    optionBName: "Human Editorial Heavy",
    directAnswer:
      "AI drafting accelerates output, but citation durability depends on human editorial control for evidence quality, nuance, and factual consistency. The best-performing system is hybrid: AI for structured first drafts, human editors for claims, sourcing, and tension-driven framing. Speed without verification creates short-lived or unsafe citation results.",
    tension:
      "Publishing velocity feels productive until unsourced claims damage trust and citation reliability.",
    rows: [
      {
        criterion: "Production speed",
        optionA: "High",
        optionB: "Medium",
      },
      {
        criterion: "Evidence quality",
        optionA: "Variable",
        optionB: "Higher when process is strict",
      },
      {
        criterion: "Style consistency",
        optionA: "High with prompt templates",
        optionB: "High with editorial standards",
      },
      {
        criterion: "Risk profile",
        optionA: "Higher hallucination risk",
        optionB: "Higher cost and slower throughput",
      },
    ],
    primaryAction:
      "Enforce a two-step workflow: AI draft generation followed by human source verification and final judgment.",
    secondaryActions: [
      "Create a no-source-no-claim editorial gate.",
      "Keep a changelog of corrected claims and retrain prompts from failures.",
      "Assign final publication ownership to one accountable editor.",
    ],
    executionPlan: [
      "Days 1-7: define editorial acceptance criteria.",
      "Days 8-14: run hybrid workflow on 10 priority articles.",
      "Days 15-30: compare citation stability and correction rate.",
    ],
    limitation:
      "Human-heavy review can become a bottleneck if roles and standards are not documented.",
    faqs: [
      {
        question: "Can AI-generated articles rank and get cited?",
        answer:
          "Yes, but sustained citation quality usually requires human verification and editorial depth.",
      },
      {
        question: "How much human editing is enough?",
        answer:
          "Enough to validate every factual claim, remove weak generalizations, and sharpen practical guidance.",
      },
      {
        question: "What is the biggest failure pattern?",
        answer:
          "Publishing fluent but unsourced drafts that look credible and then get contradicted later.",
      },
    ],
    tags: ["ai-content", "editorial", "quality", "workflow", "authority"],
  },
  {
    slug: "freshness-vs-evergreen-citation-strategy",
    title: "Freshness vs Evergreen Content: What AI Engines Prefer",
    description:
      "How to balance timely updates and durable source pages for stronger cross-platform citations.",
    date: "2026-02-23",
    optionAName: "Freshness-First",
    optionBName: "Evergreen-First",
    directAnswer:
      "Fresh content helps when platforms prioritize recency, but evergreen source pages build stronger long-term citation authority. Most teams need both: evergreen canonical pages as anchors and lightweight update layers for new developments. Recency without foundational pages fades quickly; evergreen without updates becomes outdated and less trusted.",
    tension:
      "Teams chase trending updates but neglect canonical references that AI systems can trust over time.",
    rows: [
      {
        criterion: "Short-term discoverability",
        optionA: "High",
        optionB: "Medium",
      },
      {
        criterion: "Long-term authority",
        optionA: "Lower unless archived into canonical docs",
        optionB: "High when regularly refreshed",
      },
      {
        criterion: "Maintenance effort",
        optionA: "Continuous",
        optionB: "Periodic deep updates",
      },
      {
        criterion: "Best fit",
        optionA: "News, model releases, active trends",
        optionB: "Definitions, frameworks, implementation guides",
      },
    ],
    primaryAction:
      "Create one evergreen source page per core topic, then attach monthly update summaries to keep it current.",
    secondaryActions: [
      "Stamp visible update dates and changelog notes.",
      "Merge duplicate trend posts into one maintained canonical URL.",
      "Track citation drift when content ages past 90 days.",
    ],
    executionPlan: [
      "Days 1-7: pick three evergreen pages and audit staleness.",
      "Days 8-14: publish updates and refresh evidence links.",
      "Days 15-30: add trend snapshots that point back to canonical pages.",
    ],
    limitation:
      "Freshness-heavy strategies can burn teams out without a consolidation process.",
    faqs: [
      {
        question: "Do AI systems always prefer newer content?",
        answer:
          "No. They often prefer reliable, well-structured sources unless the query requires recent events.",
      },
      {
        question: "How often should evergreen pages be updated?",
        answer:
          "Quarterly is a practical default, with immediate updates for major platform changes.",
      },
      {
        question: "Should news posts be canonical?",
        answer:
          "Usually no; direct users and bots from news updates to a stable canonical source page.",
      },
    ],
    tags: ["freshness", "evergreen", "updates", "authority", "content"],
  },
  {
    slug: "brand-prompts-vs-generic-prompts-in-measurement",
    title: "Brand Prompts vs Generic Prompts for GEO Measurement",
    description:
      "How to avoid misleading citation metrics by separating brand-biased tests from category intent tests.",
    date: "2026-02-23",
    optionAName: "Brand-Name Prompts",
    optionBName: "Generic Category Prompts",
    directAnswer:
      "Brand prompts are useful for reputation monitoring but can overstate true discoverability. Generic category prompts better measure whether your content wins without explicit brand cues. Reliable GEO reporting uses both: brand prompts for demand capture and generic prompts for competitive visibility in neutral query environments.",
    tension:
      "Teams celebrate citation wins from brand prompts while missing that they are invisible in non-branded discovery.",
    rows: [
      {
        criterion: "Measures known-brand demand",
        optionA: "High",
        optionB: "Low",
      },
      {
        criterion: "Measures category competitiveness",
        optionA: "Low",
        optionB: "High",
      },
      {
        criterion: "Bias risk",
        optionA: "Higher",
        optionB: "Lower",
      },
      {
        criterion: "Best reporting use",
        optionA: "Brand awareness and retention",
        optionB: "Market-share and discovery performance",
      },
    ],
    primaryAction:
      "Split your citation dashboard into branded and non-branded query sets starting this week.",
    secondaryActions: [
      "Maintain identical prompt templates across engines for consistency.",
      "Track source quality and attribution detail, not only mention count.",
      "Record date and model/version when capturing evidence.",
    ],
    executionPlan: [
      "Days 1-7: create 20 branded and 20 generic prompts.",
      "Days 8-14: capture baseline across major engines.",
      "Days 15-30: prioritize content gaps revealed by generic prompts.",
    ],
    limitation:
      "Generic prompt sets become stale if not revised with evolving user intent language.",
    faqs: [
      {
        question: "Should I stop tracking branded prompts?",
        answer:
          "No. Keep branded prompts for demand capture and pair them with generic tests for unbiased visibility.",
      },
      {
        question: "How many prompts are enough?",
        answer:
          "Start with 30 to 50 balanced prompts and refine monthly.",
      },
      {
        question: "What is the biggest analytics mistake?",
        answer:
          "Combining branded and generic results into one metric that hides weak non-branded discovery.",
      },
    ],
    tags: ["measurement", "prompts", "brand", "generic", "citations"],
  },
  {
    slug: "reddit-distribution-vs-owned-blog-authority",
    title: "Reddit Distribution vs Owned Blog Authority for AI Mentions",
    description:
      "Where each channel fits in a citation strategy and how to avoid platform dependency risk.",
    date: "2026-02-23",
    optionAName: "Community Distribution (Reddit)",
    optionBName: "Owned Site Authority (Blog)",
    directAnswer:
      "Community distribution can accelerate discovery and discussion signals, but owned blog pages are where durable authority compounds. Relying on only one creates risk. Use communities to distribute and validate narratives, then consolidate proven insights into canonical pages on your own domain for long-term citation control.",
    tension:
      "Teams chase external platform velocity and underinvest in canonical assets they actually own.",
    rows: [
      {
        criterion: "Speed of exposure",
        optionA: "Fast when posts resonate",
        optionB: "Slower initial ramp",
      },
      {
        criterion: "Control and ownership",
        optionA: "Low",
        optionB: "High",
      },
      {
        criterion: "Durability",
        optionA: "Variable by thread lifespan",
        optionB: "High with good maintenance",
      },
      {
        criterion: "Operational risk",
        optionA: "Policy and moderation dependence",
        optionB: "Requires consistent content operations",
      },
    ],
    primaryAction:
      "For each strong community post, publish a canonical source page that captures the validated insight.",
    secondaryActions: [
      "Link external discussions back to one authoritative URL.",
      "Update canonical pages with recurring objections from community feedback.",
      "Track citations that point to external threads versus your domain.",
    ],
    executionPlan: [
      "Days 1-7: identify top-performing community discussions.",
      "Days 8-14: convert them into canonical source pages.",
      "Days 15-30: evaluate whether citations shift to owned URLs.",
    ],
    limitation:
      "Community-led distribution is volatile and can disappear without warning due to moderation or platform changes.",
    faqs: [
      {
        question: "Is Reddit enough for GEO growth?",
        answer:
          "No. It can accelerate discovery, but you need owned canonical pages for durable authority.",
      },
      {
        question: "Should canonical pages quote community threads?",
        answer:
          "Yes, when relevant and cited properly, especially as real-world objection evidence.",
      },
      {
        question: "How do I avoid spam behavior?",
        answer:
          "Contribute context first, avoid repetitive promotion, and link only when it genuinely adds value.",
      },
    ],
    tags: ["reddit", "distribution", "owned-media", "authority", "channels"],
  },
  {
    slug: "single-canonical-vs-duplicate-url-variants",
    title: "Single Canonical Page vs URL Variants: What AI Systems Trust",
    description:
      "Why citation performance drops when the same answer is split across multiple competing URLs.",
    date: "2026-02-23",
    optionAName: "Single Canonical Source",
    optionBName: "Multiple URL Variants",
    directAnswer:
      "Single canonical pages usually outperform duplicated URL variants because authority, links, and update history accumulate in one place. Multiple near-duplicate URLs fragment trust signals and confuse retrieval systems. Keep one canonical answer page, redirect legacy variants, and clearly declare canonical tags so every signal reinforces one source.",
    tension:
      "Publishing teams create useful variants for campaigns, then accidentally split authority and indexing signals.",
    rows: [
      {
        criterion: "Signal consolidation",
        optionA: "High",
        optionB: "Low",
      },
      {
        criterion: "Maintenance burden",
        optionA: "Lower",
        optionB: "Higher",
      },
      {
        criterion: "Risk of contradictory updates",
        optionA: "Lower",
        optionB: "Higher",
      },
      {
        criterion: "Best use case",
        optionA: "Core educational/authority pages",
        optionB: "Localized or truly distinct intent pages",
      },
    ],
    primaryAction:
      "Select one canonical URL per core topic and 301 redirect non-essential duplicates within 14 days.",
    secondaryActions: [
      "Align internal links to the canonical destination.",
      "Use self-referencing canonical tags on authority pages.",
      "Update sitemap and remove stale variant URLs.",
    ],
    executionPlan: [
      "Days 1-7: inventory duplicated topic URLs.",
      "Days 8-14: set redirects and canonical tags.",
      "Days 15-30: re-crawl and verify indexing consolidation.",
    ],
    limitation:
      "Over-merging can hurt if pages actually target distinct user intent and deserve separate canonical assets.",
    faqs: [
      {
        question: "Are parameterized URLs always bad?",
        answer:
          "Not always, but core answer content should have one canonical URL for authority consolidation.",
      },
      {
        question: "Should I delete duplicate pages?",
        answer:
          "Usually redirecting is safer than deletion when legacy links exist.",
      },
      {
        question: "How fast do canonical changes impact citations?",
        answer:
          "Impact timing varies by crawl frequency, but consistency usually improves after re-crawling cycles.",
      },
    ],
    tags: ["canonical", "redirects", "technical", "indexing", "urls"],
  },
  {
    slug: "content-volume-vs-topic-coherence",
    title: "Content Volume vs Topic Coherence: What Actually Builds Authority",
    description:
      "A comparison for teams publishing heavily but still missing citations in strategic query sets.",
    date: "2026-02-23",
    optionAName: "High Volume Publishing",
    optionBName: "High Coherence Publishing",
    directAnswer:
      "Publishing more pages does not automatically create authority. AI systems reward coherent topical coverage with clear internal relationships and stable definitions. A smaller cluster of tightly linked, evidence-backed pages often outperforms large inconsistent libraries. Volume helps only when each page strengthens the same answer graph instead of fragmenting it.",
    tension:
      "Teams interpret output as progress while semantic coherence quietly declines across their library.",
    rows: [
      {
        criterion: "Perceived momentum",
        optionA: "High",
        optionB: "Moderate",
      },
      {
        criterion: "Citation consistency",
        optionA: "Variable",
        optionB: "Higher",
      },
      {
        criterion: "Editorial governance required",
        optionA: "Low at first, high later for cleanup",
        optionB: "High from day one",
      },
      {
        criterion: "Long-term compounding",
        optionA: "Weak if pages overlap/conflict",
        optionB: "Strong",
      },
    ],
    primaryAction:
      "Pause net-new publishing for one sprint and consolidate overlapping articles into a coherent topic cluster.",
    secondaryActions: [
      "Define one thesis per cluster and enforce terminology consistency.",
      "Link every supporting page to one canonical parent page.",
      "Merge or retire pages that cannibalize the same query intent.",
    ],
    executionPlan: [
      "Days 1-7: audit overlap in top 50 posts.",
      "Days 8-14: merge and relink cluster pages.",
      "Days 15-30: restart publishing with coherence checklist gates.",
    ],
    limitation:
      "Coherence programs can feel slower to stakeholders who measure output count instead of citation outcomes.",
    faqs: [
      {
        question: "Is publishing frequency irrelevant?",
        answer:
          "Frequency matters, but only when new pages reinforce a coherent authority map.",
      },
      {
        question: "How do I detect incoherence?",
        answer:
          "Look for conflicting definitions, duplicated intent pages, and missing internal links between related topics.",
      },
      {
        question: "What should I merge first?",
        answer:
          "Start with pages targeting identical or nearly identical user questions.",
      },
    ],
    tags: ["content", "topical-authority", "clusters", "strategy", "editorial"],
  },
  {
    slug: "citations-vs-clicks-growth-model",
    title: "Citations vs Clicks: Which Metric Should Lead Growth Decisions?",
    description:
      "How to balance legacy traffic metrics with new AI citation metrics in planning and reporting.",
    date: "2026-02-23",
    optionAName: "Clicks-Led Model",
    optionBName: "Citations-Led Model",
    directAnswer:
      "Clicks remain useful for conversion path analysis, but citations increasingly capture upstream influence in AI-assisted journeys. If you optimize only for clicks, you can miss growing mention share that drives branded demand later. Use a blended model: citations for influence, clicks for conversion, and track both across the same topic clusters.",
    tension:
      "Teams optimize what they can easily measure, even when user discovery behavior has shifted away from click-heavy paths.",
    rows: [
      {
        criterion: "Historical familiarity",
        optionA: "High",
        optionB: "Lower",
      },
      {
        criterion: "Captures AI answer visibility",
        optionA: "Low",
        optionB: "High",
      },
      {
        criterion: "Attribution clarity",
        optionA: "Higher in web analytics tools",
        optionB: "Still maturing and more manual",
      },
      {
        criterion: "Best strategic role",
        optionA: "Bottom/mid funnel optimization",
        optionB: "Top/mid funnel authority tracking",
      },
    ],
    primaryAction:
      "Adopt a dual KPI scorecard where each strategic page has both click and citation targets.",
    secondaryActions: [
      "Track mention quality by source and context, not just mention count.",
      "Correlate citation growth with branded search and direct traffic trends.",
      "Review KPI weighting quarterly as user behavior shifts.",
    ],
    executionPlan: [
      "Days 1-7: define KPI pairs for top topics.",
      "Days 8-14: implement weekly citation capture workflow.",
      "Days 15-30: reallocate effort based on blended KPI movement.",
    ],
    limitation:
      "Citation measurement is still noisy and partially manual; overconfidence in exact counts is a common mistake.",
    faqs: [
      {
        question: "Should I replace clicks with citations?",
        answer:
          "No. Treat citations and clicks as complementary indicators of influence and conversion.",
      },
      {
        question: "What is a good citation KPI?",
        answer:
          "Share of voice by query cluster is usually more useful than raw mention counts.",
      },
      {
        question: "How often should we report citations?",
        answer:
          "Weekly snapshots with monthly trend review is a practical cadence.",
      },
    ],
    tags: ["metrics", "citations", "clicks", "reporting", "strategy"],
  },
  {
    slug: "platform-specific-vs-unified-content-strategy",
    title: "Platform-Specific vs Unified Content Strategy for AI Search",
    description:
      "Should you tailor content separately for ChatGPT/Claude/Perplexity or maintain one unified source model?",
    date: "2026-02-23",
    optionAName: "Platform-Specific",
    optionBName: "Unified Canonical Core",
    directAnswer:
      "Platform-specific optimization can improve short-term results, but a unified canonical core is safer for scale and consistency. Build one strong source page as the truth layer, then adapt distribution and framing per platform. Without a canonical core, teams create conflicting narratives and maintenance overhead that erode trust.",
    tension:
      "Specializing for each engine feels strategic until content diverges and authority fragments.",
    rows: [
      {
        criterion: "Speed of tactical gains",
        optionA: "High",
        optionB: "Medium",
      },
      {
        criterion: "Consistency across channels",
        optionA: "Lower",
        optionB: "High",
      },
      {
        criterion: "Operational complexity",
        optionA: "High over time",
        optionB: "Moderate",
      },
      {
        criterion: "Best pattern",
        optionA: "Campaign-level experiments",
        optionB: "Core evergreen authority pages",
      },
    ],
    primaryAction:
      "Define one canonical source page per topic, then create lightweight platform adaptations from that core.",
    secondaryActions: [
      "Document what changes by platform (format, intro, examples) and what never changes (facts, definitions).",
      "Run quarterly consistency checks across adapted assets.",
      "Retire platform variants that no longer map to canonical truth.",
    ],
    executionPlan: [
      "Days 1-7: identify fragmented multi-platform assets.",
      "Days 8-14: map each asset to one canonical source.",
      "Days 15-30: standardize adaptation rules and quality checks.",
    ],
    limitation:
      "Unified strategy can underperform on niche platform behaviors if adaptation is too rigid.",
    faqs: [
      {
        question: "Do different AI engines cite different sources?",
        answer:
          "Yes, retrieval behavior differs by platform, so adaptation helps, but core facts should stay unified.",
      },
      {
        question: "How many variants should we maintain?",
        answer:
          "Keep variants minimal and tied to measurable platform differences.",
      },
      {
        question: "What breaks trust fastest?",
        answer:
          "Conflicting definitions and claims across pages that should represent the same topic.",
      },
    ],
    tags: ["platforms", "chatgpt", "claude", "perplexity", "strategy"],
  },
];

export function getComparisonHref(slug: string): string {
  return `/compare/${slug}`;
}

function getTokenSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((token) => token.length >= 3),
  );
}

export function getRelatedComparisonsForPost(
  post: Pick<BlogPost, "slug" | "title" | "description" | "category">,
  limit = 3,
): ComparisonPage[] {
  const postTokens = getTokenSet(
    `${post.slug} ${post.title} ${post.description} ${post.category}`,
  );

  const scored = comparisonPages
    .map((comparison) => {
      let score = 0;
      comparison.tags.forEach((tag) => {
        const normalized = tag.toLowerCase();
        if (postTokens.has(normalized)) {
          score += 3;
        } else if (
          Array.from(postTokens).some((token) => token.includes(normalized))
        ) {
          score += 1;
        }
      });

      if (
        post.category === "audits" &&
        comparison.tags.some((tag) =>
          ["metrics", "technical", "measurement", "canonical"].includes(tag),
        )
      ) {
        score += 2;
      }
      if (
        post.category === "fundamentals" &&
        comparison.tags.some((tag) =>
          ["geo", "seo", "strategy", "content"].includes(tag),
        )
      ) {
        score += 2;
      }
      if (
        post.category === "case-studies" &&
        comparison.tags.some((tag) =>
          ["platforms", "distribution", "workflow", "authority"].includes(tag),
        )
      ) {
        score += 2;
      }

      return { comparison, score };
    })
    .sort((a, b) => b.score - a.score);

  const filtered = scored.filter((item) => item.score > 0).slice(0, limit);
  if (filtered.length >= limit) {
    return filtered.map((item) => item.comparison);
  }

  const fallback = comparisonPages
    .filter((page) => !filtered.some((item) => item.comparison.slug === page.slug))
    .slice(0, limit - filtered.length);

  return [...filtered.map((item) => item.comparison), ...fallback];
}
