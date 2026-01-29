/**
 * Report Generation Types for GEO Analyzer
 *
 * Based on sample audit report structure:
 * - Executive Summary
 * - GEO Score Breakdown (5 sections)
 * - Page-by-Page Analysis
 * - Direct Answer Recommendations with line numbers
 * - JSON-LD Schema Recommendations
 * - Competitor Comparison
 * - Implementation Roadmap
 */

export interface PageRecommendation {
  url: string;
  pageTitle: string;
  currentContent: {
    type: 'title' | 'meta' | 'h1' | 'h2' | 'content' | 'schema' | 'faq';
    current: string;
    lineNumber?: number;
    htmlLocation?: string; // e.g., "meta description tag", "first H1", "after hero section"
  }[];
  recommendations: Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'entity_clarity' | 'direct_answers' | 'trust_signals' | 'technical' | 'schema';
    what_to_add: string;
    where_to_add: string; // e.g., "After H1, before first paragraph"
    exact_code: string; // Copy-paste ready code
    why_it_matters: string;
    estimated_impact: number; // Points improvement
    effort: '5min' | '15min' | '30min' | '1hr' | '2hr+';
  }>;
}

export interface CompetitorAnalysis {
  domain: string;
  overall_score: number;
  strengths: string[];
  citation_readiness: string; // Why AI cites them
  gap_analysis: string[]; // What they have that you don't
}

export interface DirectAnswerBlock {
  page_url: string;
  current_state: {
    has_direct_answer: boolean;
    current_answer?: string;
    word_count?: number;
    location?: string;
  };
  recommendation: {
    suggested_h1: string;
    suggested_answer: string; // 40-60 words, factual
    word_count: number;
    exact_html: string; // Ready to paste
  };
  estimated_impact: number;
}

export interface SchemaRecommendation {
  schema_type: 'Organization' | 'FAQPage' | 'Product' | 'Service' | 'Article' | 'Person' | 'WebSite';
  current_state: {
    exists: boolean;
    current_content?: any;
    missing_fields?: string[];
  };
  recommendation: {
    exact_json_ld: string; // Complete JSON-LD to add
    where_to_place: string; // e.g., "In <head>, after <title>"
    priority: 'critical' | 'high' | 'medium';
  };
  estimated_impact: number;
}

export interface ReportSection {
  title: string;
  score: number;
  max_score: number;
  weight: number; // Percentage of overall score
  status: 'critical' | 'needs_work' | 'adequate' | 'good' | 'excellent';
  findings: {
    what_we_found: string;
    why_it_matters: string;
    evidence: string[];
  };
  recommendations: Array<{
    action: string;
    expected_improvement: number;
    effort_level: 1 | 2 | 3 | 4 | 5;
    pages_affected: string[];
  }>;
}

export interface FullReport {
  // Metadata
  domain: string;
  analysis_date: string;
  report_id: string;

  // Executive Summary
  executive_summary: {
    overall_score: number;
    tier: string;
    one_sentence_summary: string;
    key_findings: string[];
    primary_obstacle: string;
    quick_wins: string[]; // Top 3 high-impact, low-effort fixes
  };

  // Detailed Section Scores
  sections: {
    entity_clarity: ReportSection;
    direct_answers: ReportSection;
    trust_signals: ReportSection;
    competitive_positioning: ReportSection;
    technical_accessibility: ReportSection;
  };

  // Page-by-Page Analysis
  page_analysis: PageRecommendation[];

  // Direct Answer Blocks
  direct_answer_recommendations: DirectAnswerBlock[];

  // Schema Recommendations
  schema_recommendations: SchemaRecommendation[];

  // Competitor Analysis
  competitor_analysis: CompetitorAnalysis[];

  // Implementation Roadmap
  implementation_roadmap: {
    week_1: {
      priority: 'critical' | 'high';
      tasks: Array<{
        task: string;
        pages: string[];
        effort: string;
        impact: number;
      }>;
    };
    week_2_4: {
      priority: 'high' | 'medium';
      tasks: Array<{
        task: string;
        pages: string[];
        effort: string;
        impact: number;
      }>;
    };
    ongoing: {
      priority: 'medium' | 'low';
      tasks: Array<{
        task: string;
        frequency: string;
        impact: number;
      }>;
    };
  };

  // Score Projection
  score_projection: {
    current_score: number;
    after_week_1: number;
    after_week_4: number;
    after_3_months: number;
    target_score: number;
  };

  // Technical Appendix
  technical_appendix: {
    pages_crawled: number;
    total_words_analyzed: number;
    json_ld_found: number;
    faqs_found: number;
    entity_mentions_found: number;
    crawl_errors: string[];
    limitations: string[];
  };
}

// Helper functions for report generation
export function getScoreStatus(score: number): 'critical' | 'needs_work' | 'adequate' | 'good' | 'excellent' {
  if (score < 40) return 'critical';
  if (score < 60) return 'needs_work';
  if (score < 75) return 'adequate';
  if (score < 90) return 'good';
  return 'excellent';
}

export function getScoreColor(score: number): string {
  if (score < 40) return '#EF4444'; // red
  if (score < 60) return '#F59E0B'; // amber
  if (score < 75) return '#3B82F6'; // blue
  if (score < 90) return '#10B981'; // green
  return '#059669'; // emerald
}

export function getTierFromScore(score: number): string {
  if (score < 40) return 'Invisible to AI';
  if (score < 60) return 'Weak / Inconsistent';
  if (score < 75) return 'Functional AI Presence';
  if (score < 90) return 'AI-Reference Capable';
  return 'Primary Citation Candidate';
}
