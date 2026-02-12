export interface AIQuerySimulation {
  query: string;
  mentioned: boolean;
  position: number | null;
  snippet: string;
  competitors_mentioned: string[];
}

export interface RealCompetitor {
  name: string;
  url?: string;
  ai_readiness_estimate: number;
  strengths: string[];
}

export interface CopyBlock {
  type: "meta_description" | "faq_section" | "about_paragraph" | "page_title";
  page_url?: string;
  current?: string;
  suggested: string;
  why: string;
  questions?: Array<{ q: string; a: string }>;
}

export interface RemediationChange {
  priority: "high" | "medium" | "low";
  change_type:
    | "direct_answer"
    | "faq"
    | "json_ld"
    | "entity_clarity"
    | "trust_signal";
  placement: string;
  exact_example_text: string;
  example_json_ld?: string;
}

export interface PageRemediation {
  url: string;
  page_type: "homepage" | "service" | "article" | "category" | "other";
  diagnosis: {
    page_score?: number;
    dominant_gap:
      | "direct_answer_quality"
      | "entity_clarity"
      | "trust_signals"
      | "structured_data_quality";
    ai_hesitation: string;
  };
  recommended_changes: RemediationChange[];
}

export interface GeoScore {
  overall_score: number;
  tier: string;
  section_scores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    competitive_positioning: number;
    technical_accessibility: number;
  };
  top_ai_hesitations: Array<{
    issue: string;
    why_ai_hesitates: string;
    evidence: string[];
    affected_urls: string[];
  }>;
  week1_fix_plan: string[];
  limitations: string[];
  // Extracted data shown in report
  extracted_faqs: string[];
  extracted_json_ld: any[];
  // AI query simulations ("How AI Sees You")
  ai_query_simulations?: AIQuerySimulation[];
  // Per-page remediation details (for full report)
  page_remediations?: PageRemediation[];
  // Real competitor analysis
  real_competitors?: RealCompetitor[];
  // Ready-to-paste copy blocks (paid feature)
  copy_blocks?: CopyBlock[];
  // Payment status (free = 1 page shown, paid = all pages shown)
  payment_status?: "free" | "paid";
}

// ── Deep multi-page analysis types (paid report) ──────────────

export interface PageAnalysis {
  url: string;
  page_type: "homepage" | "service" | "about" | "faq" | "pricing" | "contact" | "product" | "other";
  title: string;
  meta_description: string;

  // Per-page AI readiness scores
  page_score: number;
  scores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    structured_data: number;
  };

  // What AI systems see/miss on this specific page
  ai_snapshot: string; // 2-3 sentence summary of how AI sees this page
  dominant_gap: "entity_clarity" | "direct_answers" | "trust_signals" | "structured_data" | "content_depth";

  // Actionable fixes for THIS page
  fixes: Array<{
    priority: "critical" | "high" | "medium";
    action: string; // e.g., "Add FAQ section with schema markup"
    current_state: string; // what exists now
    suggested_content: string; // exact text/code to add
    impact: string; // "High — directly increases citation probability for X queries"
  }>;

  // Structured data recommendations
  schema_recommendations: Array<{
    schema_type: string; // e.g., "FAQPage", "LocalBusiness"
    exists: boolean;
    json_ld_snippet: string; // ready-to-paste JSON-LD
  }>;
}

export interface ContentStrategy {
  priority: number;
  title: string;
  description: string;
  target_queries: string[]; // AI queries this would help with
  content_outline: string; // what to write
  placement: string; // where to put it
  expected_impact: string;
}

export interface ReportDetails {
  // Multi-page analysis
  pages_analyzed: PageAnalysis[];
  total_pages_crawled: number;

  // Cross-page insights
  site_wide_issues: Array<{
    issue: string;
    severity: "critical" | "high" | "medium";
    affected_pages: string[];
    fix: string;
  }>;

  // Content gap analysis
  content_gaps: Array<{
    gap: string; // e.g., "No FAQ content addressing common queries"
    opportunity: string;
    suggested_queries: string[]; // queries this could capture
  }>;

  // AI visibility content strategy
  content_strategy: ContentStrategy[];

  // Internal linking for AI context
  internal_linking_recommendations: Array<{
    from_page: string;
    to_page: string;
    anchor_text: string;
    reason: string;
  }>;

  // Schema.org coverage map
  schema_coverage: {
    existing_types: string[];
    missing_recommended: string[];
    overall_schema_score: number;
  };

  // 30-day implementation roadmap
  implementation_roadmap: Array<{
    week: number; // 1-4
    tasks: Array<{
      task: string;
      page: string;
      effort: "low" | "medium" | "high";
      impact: "low" | "medium" | "high";
    }>;
  }>;
}

export interface AnalysisRequest {
  url: string;
  email: string;
}

export interface CrawlData {
  url: string;
  title: string;
  metaDescription: string;
  html: string;
  cleanedHtml: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  textContent: string;
  jsonLd: any[];
  signals: {
    entityMentions: string[];
    locationMentions: string[];
    dateMentions: string[];
    hedgingWords: number;
    directAnswerBlocks: string[];
  };
}
