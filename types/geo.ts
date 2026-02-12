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
  page_type:
    | "homepage"
    | "service"
    | "about"
    | "faq"
    | "pricing"
    | "contact"
    | "product"
    | "other";
  title: string;
  meta_description: string;
  page_score: number;
  scores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    structured_data: number;
  };
  ai_snapshot: string;
  dominant_gap:
    | "entity_clarity"
    | "direct_answers"
    | "trust_signals"
    | "structured_data"
    | "content_depth";
  fixes: Array<{
    priority: "critical" | "high" | "medium";
    action: string;
    current_state: string;
    suggested_content: string;
    impact: string;
  }>;
  schema_recommendations: Array<{
    schema_type: string;
    exists: boolean;
    json_ld_snippet: string;
  }>;
}

export interface ContentStrategy {
  priority: number;
  title: string;
  description: string;
  target_queries: string[];
  content_outline: string;
  placement: string;
  expected_impact: string;
}

export interface ReportDetails {
  pages_analyzed: PageAnalysis[];
  total_pages_crawled: number;
  site_wide_issues: Array<{
    issue: string;
    severity: "critical" | "high" | "medium";
    affected_pages: string[];
    fix: string;
  }>;
  content_gaps: Array<{
    gap: string;
    opportunity: string;
    suggested_queries: string[];
  }>;
  content_strategy: ContentStrategy[];
  internal_linking_recommendations: Array<{
    from_page: string;
    to_page: string;
    anchor_text: string;
    reason: string;
  }>;
  schema_coverage: {
    existing_types: string[];
    missing_recommended: string[];
    overall_schema_score: number;
  };
  implementation_roadmap: Array<{
    week: number;
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
