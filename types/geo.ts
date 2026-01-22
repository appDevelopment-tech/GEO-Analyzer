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
}

export interface AnalysisRequest {
  url: string;
  email: string;
}

export interface CrawlData {
  url: string;
  title: string;
  metaDescription: string;
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
