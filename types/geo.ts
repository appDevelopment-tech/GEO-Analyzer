export interface AIQuerySimulation {
  query: string;
  mentioned: boolean;
  position: number | null;
  snippet: string;
  competitors_mentioned: string[];
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
  // Payment status (free = 1 page shown, paid = all pages shown)
  payment_status?: "free" | "paid";
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
