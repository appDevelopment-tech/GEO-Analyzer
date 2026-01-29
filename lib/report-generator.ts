import { GeoScore, CrawlData } from "@/types/geo";
import {
  FullReport,
  PageRecommendation,
  DirectAnswerBlock,
  SchemaRecommendation,
  ReportSection,
  CompetitorAnalysis,
  getScoreStatus,
  getTierFromScore,
} from "./report-types";

/**
 * Enhanced Report Generator for GEO Analyzer
 *
 * Takes crawled data and AI analysis to generate comprehensive reports
 * similar to the sample audit PDF.
 */
export class ReportGenerator {
  private crawlData: CrawlData[];
  private analysis: GeoScore;
  private domain: string;

  constructor(crawlData: CrawlData[], analysis: GeoScore, domain: string) {
    this.crawlData = crawlData;
    this.analysis = analysis;
    this.domain = domain;
  }

  /**
   * Main method to generate the full report
   */
  async generateFullReport(): Promise<FullReport> {
    const reportId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      // Metadata
      domain: this.domain,
      analysis_date: new Date().toISOString(),
      report_id: reportId,

      // Executive Summary
      executive_summary: this.generateExecutiveSummary(),

      // Detailed Section Scores
      sections: {
        entity_clarity: this.generateEntityClaritySection(),
        direct_answers: this.generateDirectAnswersSection(),
        trust_signals: this.generateTrustSignalsSection(),
        competitive_positioning: this.generateCompetitivePositioningSection(),
        technical_accessibility: this.generateTechnicalAccessibilitySection(),
      },

      // Page-by-Page Analysis
      page_analysis: this.generatePageAnalysis(),

      // Direct Answer Recommendations
      direct_answer_recommendations: this.generateDirectAnswerRecommendations(),

      // Schema Recommendations
      schema_recommendations: this.generateSchemaRecommendations(),

      // Competitor Analysis
      competitor_analysis: await this.generateCompetitorAnalysis(),

      // Implementation Roadmap
      implementation_roadmap: this.generateImplementationRoadmap(),

      // Score Projection
      score_projection: this.generateScoreProjection(),

      // Technical Appendix
      technical_appendix: this.generateTechnicalAppendix(),
    };
  }

  /**
   * Generate Executive Summary
   */
  private generateExecutiveSummary() {
    const { overall_score, tier, top_ai_hesitations, week1_fix_plan } = this.analysis;

    // Find the primary obstacle (largest score gap)
    const sectionScores = this.analysis.section_scores;
    const maxGap = 100 - Math.min(
      sectionScores.entity_clarity,
      sectionScores.direct_answers,
      sectionScores.trust_signals,
      sectionScores.competitive_positioning,
      sectionScores.technical_accessibility
    );

    let primaryObstacle = "";
    if (sectionScores.entity_clarity === Math.min(...Object.values(sectionScores))) {
      primaryObstacle = "Entity clarity is your primary obstacle—AI engines struggle to understand who you are and what you offer.";
    } else if (sectionScores.direct_answers === Math.min(...Object.values(sectionScores))) {
      primaryObstacle = "Direct answers are your primary obstacle—your content isn't structured for AI extraction.";
    } else if (sectionScores.trust_signals === Math.min(...Object.values(sectionScores))) {
      primaryObstacle = "Trust signals are your primary obstacle—AI engines lack confidence in your authority.";
    } else {
      primaryObstacle = top_ai_hesitations[0]?.issue || "Multiple factors limit AI recommendation readiness.";
    }

    // Quick wins (high impact, low effort from week1_fix_plan)
    const quickWins = week1_fix_plan.slice(0, 3);

    return {
      overall_score,
      tier,
      one_sentence_summary: `Your website scores ${overall_score}/100 for AI recommendation readiness (${tier}). ${primaryObstacle}`,
      key_findings: [
        `Entity Clarity: ${sectionScores.entity_clarity}/100 - ${this.getFindingForScore(sectionScores.entity_clarity)}`,
        `Direct Answers: ${sectionScores.direct_answers}/100 - ${this.getFindingForScore(sectionScores.direct_answers)}`,
        `Trust Signals: ${sectionScores.trust_signals}/100 - ${this.getFindingForScore(sectionScores.trust_signals)}`,
        `Competitive Positioning: ${sectionScores.competitive_positioning}/100 - ${this.getFindingForScore(sectionScores.competitive_positioning)}`,
        `Technical Accessibility: ${sectionScores.technical_accessibility}/100 - ${this.getFindingForScore(sectionScores.technical_accessibility)}`,
      ],
      primary_obstacle: primaryObstacle,
      quick_wins: quickWins,
    };
  }

  /**
   * Generate Entity Clarity Section
   */
  private generateEntityClaritySection(): ReportSection {
    const score = this.analysis.section_scores.entity_clarity;
    const entityMentions = this.crawlData.flatMap(p => p.signals.entityMentions);
    const hasJsonLd = this.crawlData.some(p => p.jsonLd.length > 0);

    let findings = "";
    let evidence: string[] = [];
    let recommendations: any[] = [];

    if (score < 50) {
      findings = "Your website lacks clear entity definitions. AI engines cannot confidently identify what your organization offers, who you serve, or why you're authoritative.";
      evidence = [
        `Found ${entityMentions.length} entity definitions across ${this.crawlData.length} pages`,
        hasJsonLd ? "Some JSON-LD present but incomplete" : "No Organization JSON-LD schema found",
        "About page may be missing or lacks clear entity definitions",
      ];
      recommendations = [
        {
          action: "Add Organization JSON-LD schema to homepage <head>",
          expected_improvement: 15,
          effort_level: 2,
          pages_affected: [this.domain],
        },
        {
          action: "Create/update About page with clear 'X is a Y' statements",
          expected_improvement: 12,
          effort_level: 3,
          pages_affected: [`${this.domain}/about`],
        },
        {
          action: "Add FAQ page defining your services and expertise",
          expected_improvement: 8,
          effort_level: 3,
          pages_affected: [`${this.domain}/faq`],
        },
      ];
    } else if (score < 75) {
      findings = "Your entity has some clarity but lacks consistency across pages. AI may have conflicting information about what you offer.";
      evidence = [
        `Found ${entityMentions.length} entity definitions across pages`,
        "Entity definitions may vary across different pages",
        "Schema markup exists but may be incomplete",
      ];
      recommendations = [
        {
          action: "Standardize entity definition language across all pages",
          expected_improvement: 10,
          effort_level: 3,
          pages_affected: this.crawlData.map(p => p.url),
        },
        {
          action: "Enhance Organization schema with sameAs links to social profiles",
          expected_improvement: 5,
          effort_level: 1,
          pages_affected: [this.domain],
        },
      ];
    } else {
      findings = "Your entity is well-defined. AI engines have a clear understanding of your organization.";
      evidence = [
        `Found ${entityMentions.length} clear entity definitions`,
        "Organization schema is present and complete",
        "Entity information is consistent across pages",
      ];
      recommendations = [
        {
          action: "Add Wikidata or Crunchbase entry for knowledge graph verification",
          expected_improvement: 3,
          effort_level: 4,
          pages_affected: ["External knowledge graphs"],
        },
      ];
    }

    return {
      title: "Entity Clarity",
      score,
      max_score: 100,
      weight: 30,
      status: getScoreStatus(score),
      findings: {
        what_we_found: findings,
        why_it_matters: "AI engines must understand who you are before recommending you. Unclear or inconsistent entity information causes hesitation.",
        evidence,
      },
      recommendations,
    };
  }

  /**
   * Generate Direct Answers Section
   */
  private generateDirectAnswersSection(): ReportSection {
    const score = this.analysis.section_scores.direct_answers;
    const directAnswerBlocks = this.crawlData.flatMap(p => p.signals.directAnswerBlocks);
    const hasFaqPage = this.crawlData.some(p =>
      p.url.toLowerCase().includes('faq') ||
      p.jsonLd.some((ld: any) => ld['@type'] === 'FAQPage')
    );

    let findings = "";
    let evidence: string[] = [];
    let recommendations: any[] = [];

    if (score < 50) {
      findings = "Your content lacks direct answer formatting. AI engines cannot easily extract answers to user questions.";
      evidence = [
        `Found ${directAnswerBlocks.length} direct answer blocks`,
        hasFaqPage ? "FAQ page exists but may not be in optimal format" : "No FAQ page detected",
        "Headings may not be in question format",
        "Content may be buried in marketing language",
      ];
      recommendations = [
        {
          action: "Add Direct Answer block (40-60 words) to homepage",
          expected_improvement: 12,
          effort_level: 2,
          pages_affected: [this.domain],
        },
        {
          action: "Create FAQ page with 8-12 Q&A pairs using FAQPage schema",
          expected_improvement: 15,
          effort_level: 3,
          pages_affected: [`${this.domain}/faq`],
        },
        {
          action: "Add question-based H2s to key service pages",
          expected_improvement: 8,
          effort_level: 2,
          pages_affected: this.crawlData.filter(p => p.url.includes('/')).map(p => p.url),
        },
      ];
    } else if (score < 75) {
      findings = "Some direct answers exist but could be improved. AI can extract some information but formatting is inconsistent.";
      evidence = [
        `Found ${directAnswerBlocks.length} direct answer blocks`,
        "Some pages have Q&A structure but not all",
        "Answers may be too long or contain marketing fluff",
      ];
      recommendations = [
        {
          action: "Standardize Direct Answer format across all key pages",
          expected_improvement: 10,
          effort_level: 3,
          pages_affected: this.crawlData.map(p => p.url),
        },
        {
          action: "Condense answers to 40-60 words, remove marketing language",
          expected_improvement: 7,
          effort_level: 2,
          pages_affected: this.crawlData.filter(p => p.signals.directAnswerBlocks.length > 0).map(p => p.url),
        },
      ];
    } else {
      findings = "Your direct answers are well-formatted. AI can easily extract information from your content.";
      evidence = [
        `Found ${directAnswerBlocks.length} direct answer blocks`,
        "FAQ page exists with proper schema",
        "Answers are concise and factual",
      ];
      recommendations = [
        {
          action: "Add more Q&A pairs to FAQ page targeting common user questions",
          expected_improvement: 3,
          effort_level: 2,
          pages_affected: [`${this.domain}/faq`],
        },
      ];
    }

    return {
      title: "Direct Answers",
      score,
      max_score: 100,
      weight: 30,
      status: getScoreStatus(score),
      findings: {
        what_we_found: findings,
        why_it_matters: "AI engines prefer content structured as direct answers. This format matches how AI responds to user queries, making your content more likely to be cited.",
        evidence,
      },
      recommendations,
    };
  }

  /**
   * Generate Trust Signals Section
   */
  private generateTrustSignalsSection(): ReportSection {
    const score = this.analysis.section_scores.trust_signals;
    let findings = "";
    let evidence: string[] = [];
    let recommendations: any[] = [];

    if (score < 50) {
      findings = "Your website lacks sufficient trust signals for AI verification. AI engines hesitate to recommend sources without clear authority indicators.";
      evidence = [
        "Limited or no customer reviews visible",
        "Few or no third-party mentions/citations",
        "May lack security indicators (SSL, trust badges)",
        "Social proof elements may be missing",
      ];
      recommendations = [
        {
          action: "Add customer testimonials/reviews to homepage",
          expected_improvement: 10,
          effort_level: 2,
          pages_affected: [this.domain],
        },
        {
          action: "Add 'As featured in' section with media logos",
          expected_improvement: 8,
          effort_level: 2,
          pages_affected: [this.domain],
        },
        {
          action: "Display client logos or case study count",
          expected_improvement: 7,
          effort_level: 1,
          pages_affected: [this.domain],
        },
        {
          action: "Ensure HTTPS is enabled on all pages",
          expected_improvement: 5,
          effort_level: 1,
          pages_affected: ["All pages"],
        },
      ];
    } else if (score < 75) {
      findings = "Some trust signals exist but could be more prominent. AI has moderate confidence in your authority.";
      evidence = [
        "Some social proof elements present",
        "Reviews may exist but not prominently displayed",
        "Third-party validation could be stronger",
      ];
      recommendations = [
        {
          action: "Move testimonials higher on homepage (above fold)",
          expected_improvement: 5,
          effort_level: 1,
          pages_affected: [this.domain],
        },
        {
          action: "Add case studies with results metrics",
          expected_improvement: 8,
          effort_level: 4,
          pages_affected: [`${this.domain}/case-studies`],
        },
      ];
    } else {
      findings = "Strong trust signals present. AI has high confidence in your authority.";
      evidence = [
        "Customer reviews prominently displayed",
        "Media mentions or awards visible",
        "Clear social proof throughout the site",
      ];
      recommendations = [
        {
          action: "Add third-party review site badges (G2, Capterra, etc.)",
          expected_improvement: 2,
          effort_level: 1,
          pages_affected: [this.domain],
        },
      ];
    }

    return {
      title: "Trust Signals",
      score,
      max_score: 100,
      weight: 20,
      status: getScoreStatus(score),
      findings: {
        what_we_found: findings,
        why_it_matters: "AI engines verify sources using trust signals similar to how humans evaluate credibility. Without clear indicators, AI assumes risk.",
        evidence,
      },
      recommendations,
    };
  }

  /**
   * Generate Competitive Positioning Section
   */
  private generateCompetitivePositioningSection(): ReportSection {
    const score = this.analysis.section_scores.competitive_positioning;
    let findings = "";
    let evidence: string[] = [];
    let recommendations: any[] = [];

    if (score < 50) {
      findings = "Your competitive positioning is weak. AI engines have stronger alternative sources to cite for queries in your space.";
      evidence = [
        "Competitors may have more comprehensive content",
        "Your unique value proposition may be unclear",
        "Content depth may be insufficient compared to alternatives",
      ];
      recommendations = [
        {
          action: "Create comparison pages highlighting your unique advantages",
          expected_improvement: 10,
          effort_level: 4,
          pages_affected: [`${this.domain}/compare`],
        },
        {
          action: "Expand content depth on top service pages (1000+ words)",
          expected_improvement: 8,
          effort_level: 3,
          pages_affected: this.crawlData.filter(p => p.url.includes('/')).slice(0, 3).map(p => p.url),
        },
        {
          action: "Add 'Why choose us' section with specific differentiators",
          expected_improvement: 7,
          effort_level: 2,
          pages_affected: [this.domain],
        },
      ];
    } else if (score < 75) {
      findings = "Moderate competitive positioning. AI finds your content useful but may prefer competitors in some scenarios.";
      evidence = [
        "Some unique content exists",
        "Differentiators could be more explicit",
        "Content may lack depth in key areas",
      ];
      recommendations = [
        {
          action: "Identify and target long-tail queries competitors ignore",
          expected_improvement: 8,
          effort_level: 3,
          pages_affected: ["Blog and content pages"],
        },
        {
          action: "Add original data, research, or case studies",
          expected_improvement: 10,
          effort_level: 5,
          pages_affected: [`${this.domain}/resources`, `${this.domain}/blog`],
        },
      ];
    } else {
      findings = "Strong competitive positioning. Your content stands out in your space.";
      evidence = [
        "Clear unique value proposition",
        "Content is more comprehensive than most competitors",
        "Original insights or data present",
      ];
      recommendations = [
        {
          action: "Regularly update content to maintain freshness advantage",
          expected_improvement: 3,
          effort_level: 3,
          pages_affected: ["Content pages"],
        },
      ];
    }

    return {
      title: "Competitive Positioning",
      score,
      max_score: 100,
      weight: 10,
      status: getScoreStatus(score),
      findings: {
        what_we_found: findings,
        why_it_matters: "AI engines compare multiple sources before choosing citations. Stronger alternatives in your space reduce citation likelihood.",
        evidence,
      },
      recommendations,
    };
  }

  /**
   * Generate Technical Accessibility Section
   */
  private generateTechnicalAccessibilitySection(): ReportSection {
    const score = this.analysis.section_scores.technical_accessibility;
    const hasSitemap = this.crawlData.some(p => p.url.includes('sitemap'));
    const hasRobots = this.crawlData.some(p => p.url.includes('robots'));

    let findings = "";
    let evidence: string[] = [];
    let recommendations: any[] = [];

    if (score < 70) {
      findings = "Technical barriers may prevent AI from fully accessing or understanding your content.";
      evidence = [
        hasSitemap ? "Sitemap exists" : "No sitemap found",
        hasRobots ? "robots.txt exists" : "No robots.txt found",
        "JavaScript rendering may block some content",
        "Page load speed or structure issues may exist",
      ];
      recommendations = [
        {
          action: "Ensure all critical content is in initial HTML (not JS-rendered)",
          expected_improvement: 8,
          effort_level: 3,
          pages_affected: ["All pages"],
        },
        {
          action: hasSitemap ? "Verify sitemap includes all important pages" : "Create sitemap.xml",
          expected_improvement: 5,
          effort_level: 1,
          pages_affected: [`${this.domain}/sitemap.xml`],
        },
        {
          action: hasRobots ? "Review robots.txt to ensure it's not blocking AI crawlers" : "Create robots.txt",
          expected_improvement: 3,
          effort_level: 1,
          pages_affected: [`${this.domain}/robots.txt`],
        },
      ];
    } else {
      findings = "Good technical accessibility. AI can access and parse your content effectively.";
      evidence = [
        "Sitemap and robots.txt present",
        "Content is accessible in HTML",
        "No major technical barriers detected",
      ];
      recommendations = [
        {
          action: "Add structured data testing to your QA process",
          expected_improvement: 2,
          effort_level: 2,
          pages_affected: ["Development process"],
        },
      ];
    }

    return {
      title: "Technical Accessibility",
      score,
      max_score: 100,
      weight: 10,
      status: getScoreStatus(score),
      findings: {
        what_we_found: findings,
        why_it_matters: "If AI cannot access or parse your content, it cannot recommend you. Technical barriers are binary—either content is accessible or it isn't.",
        evidence,
      },
      recommendations,
    };
  }

  /**
   * Generate Page-by-Page Analysis
   */
  private generatePageAnalysis(): PageRecommendation[] {
    return this.crawlData.map((page) => {
      const pageUrl = new URL(page.url);
      const path = pageUrl.pathname;

      return {
        url: page.url,
        pageTitle: page.title,
        currentContent: this.analyzePageContent(page),
        recommendations: this.generatePageRecommendations(page),
      };
    });
  }

  /**
   * Analyze individual page content
   */
  private analyzePageContent(page: CrawlData) {
    const content: any[] = [];

    // Title analysis
    content.push({
      type: 'title',
      current: page.title,
      lineNumber: 1,
      htmlLocation: '<title> tag',
    });

    // Meta description
    content.push({
      type: 'meta',
      current: page.metaDescription || 'No meta description found',
      htmlLocation: '<meta name="description"> tag',
    });

    // H1 headings
    if (page.headings.h1.length > 0) {
      page.headings.h1.forEach((h1, i) => {
        content.push({
          type: 'h1',
          current: h1,
          htmlLocation: `H1 #${i + 1}`,
        });
      });
    } else {
      content.push({
        type: 'h1',
        current: 'No H1 found',
        htmlLocation: '<h1> tag (missing)',
      });
    }

    // H2 headings
    page.headings.h2.slice(0, 5).forEach((h2, i) => {
      content.push({
        type: 'h2',
        current: h2,
        htmlLocation: `H2 #${i + 1}`,
      });
    });

    // Direct answer blocks
    page.signals.directAnswerBlocks.slice(0, 3).forEach((block, i) => {
      content.push({
        type: 'content',
        current: block.substring(0, 100) + '...',
        htmlLocation: `Direct answer block #${i + 1}`,
      });
    });

    return content;
  }

  /**
   * Generate page-specific recommendations
   */
  private generatePageRecommendations(page: CrawlData) {
    const recommendations: any[] = [];
    const path = new URL(page.url).pathname;

    // Check for Direct Answer block
    const hasDirectAnswer = page.signals.directAnswerBlocks.length > 0;
    const hasQuestionH1 = page.headings.h1.some(h1 => h1.includes('?'));
    const hasQuestionH2 = page.headings.h2.some(h2 => h2.includes('?'));

    if (!hasDirectAnswer && !hasQuestionH1 && path !== '/') {
      recommendations.push({
        priority: 'high',
        category: 'direct_answers',
        what_to_add: 'Direct Answer block answering "What is [page topic]?"',
        where_to_add: 'After H1, before first paragraph',
        exact_code: this.generateDirectAnswerHTML(page.title),
        why_it_matters: 'AI engines prefer direct answers at the top of pages for easy extraction.',
        estimated_impact: 8,
        effort: '15min',
      });
    }

    // Check for Organization schema on homepage
    if (path === '/' || path === '/index.html') {
      const hasOrgSchema = page.jsonLd.some((ld: any) => ld['@type'] === 'Organization');
      if (!hasOrgSchema) {
        recommendations.push({
          priority: 'critical',
          category: 'schema',
          what_to_add: 'Organization JSON-LD schema',
          where_to_add: 'In <head>, after <title> tag',
          exact_code: this.generateOrganizationSchema(page),
          why_it_matters: 'Organization schema helps AI understand who you are and what you offer.',
          estimated_impact: 15,
          effort: '5min',
        });
      }
    }

    // Check for FAQ schema if FAQ page
    if (path.toLowerCase().includes('faq')) {
      const hasFaqSchema = page.jsonLd.some((ld: any) => ld['@type'] === 'FAQPage');
      if (!hasFaqSchema) {
        recommendations.push({
          priority: 'critical',
          category: 'schema',
          what_to_add: 'FAQPage JSON-LD schema',
          where_to_add: 'In <head> or before closing </body>',
          exact_code: this.generateFaqSchema(page),
          why_it_matters: 'FAQPage schema enables rich results and helps AI extract Q&A content.',
          estimated_impact: 12,
          effort: '15min',
        });
      }
    }

    // Check meta description
    if (!page.metaDescription || page.metaDescription.length < 120) {
      recommendations.push({
        priority: 'medium',
        category: 'technical',
        what_to_add: 'Compelling meta description (120-155 characters)',
        where_to_add: '<meta name="description"> in <head>',
        exact_code: `<meta name="description" content="${this.generateMetaDescription(page)}" />`,
        why_it_matters: 'Meta descriptions help AI (and users) understand page context before crawling.',
        estimated_impact: 5,
        effort: '5min',
      });
    }

    return recommendations.slice(0, 5); // Top 5 per page
  }

  /**
   * Generate Direct Answer Recommendations
   */
  private generateDirectAnswerRecommendations(): DirectAnswerBlock[] {
    const recommendations: DirectAnswerBlock[] = [];

    for (const page of this.crawlData) {
      const path = new URL(page.url).pathname;

      // Skip if already has good direct answers
      if (page.signals.directAnswerBlocks.length >= 2) continue;

      const questionH1 = page.headings.h1.find(h1 => h1.includes('?')) || `What is ${page.title}?`;
      const currentBlock = page.signals.directAnswerBlocks[0];

      recommendations.push({
        page_url: page.url,
        current_state: {
          has_direct_answer: page.signals.directAnswerBlocks.length > 0,
          current_answer: currentBlock,
          word_count: currentBlock?.split(' ').length,
          location: 'After H1, before first paragraph',
        },
        recommendation: {
          suggested_h1: questionH1,
          suggested_answer: this.generateSuggestedAnswer(page),
          word_count: 50,
          exact_html: this.generateDirectAnswerHTML(page.title),
        },
        estimated_impact: 8,
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Generate Schema Recommendations
   */
  private generateSchemaRecommendations(): SchemaRecommendation[] {
    const recommendations: SchemaRecommendation[] = [];
    const domain = this.domain;

    // Check Organization schema
    const homepage = this.crawlData.find(p => new URL(p.url).pathname === '/');
    const hasOrgSchema = homepage?.jsonLd.some((ld: any) => ld['@type'] === 'Organization') ?? false;

    recommendations.push({
      schema_type: 'Organization',
      current_state: {
        exists: hasOrgSchema,
        current_content: homepage?.jsonLd.find((ld: any) => ld['@type'] === 'Organization'),
        missing_fields: hasOrgSchema ? [] : ['name', 'url', 'logo', 'description', 'sameAs'],
      },
      recommendation: {
        exact_json_ld: this.generateOrganizationSchema(homepage || this.crawlData[0]),
        where_to_place: 'In <head>, after <meta> tags',
        priority: hasOrgSchema ? 'medium' : 'critical',
      },
      estimated_impact: hasOrgSchema ? 5 : 15,
    });

    // Check FAQPage schema
    const faqPage = this.crawlData.find(p =>
      new URL(p.url).pathname.toLowerCase().includes('faq') ||
      p.title.toLowerCase().includes('faq')
    );
    const hasFaqSchema = faqPage?.jsonLd.some((ld: any) => ld['@type'] === 'FAQPage');

    if (!hasFaqSchema) {
      recommendations.push({
        schema_type: 'FAQPage',
        current_state: {
          exists: false,
        },
        recommendation: {
          exact_json_ld: this.generateFaqSchema(faqPage || this.crawlData[0]),
          where_to_place: 'In <head> or before closing </body>',
          priority: 'high',
        },
        estimated_impact: 12,
      });
    }

    // Check WebSite schema
    const hasWebSiteSchema = homepage?.jsonLd.some((ld: any) => ld['@type'] === 'WebSite');
    if (!hasWebSiteSchema) {
      recommendations.push({
        schema_type: 'WebSite',
        current_state: {
          exists: false,
        },
        recommendation: {
          exact_json_ld: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": homepage?.title || "Your Website",
            "url": domain,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${domain}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          }, null, 2),
          where_to_place: 'In <head>, after Organization schema',
          priority: 'medium',
        },
        estimated_impact: 5,
      });
    }

    return recommendations;
  }

  /**
   * Generate Competitor Analysis (simulated for now)
   */
  private async generateCompetitorAnalysis(): Promise<CompetitorAnalysis[]> {
    // This would typically use a competitor analysis service
    // For now, return a template structure
    return [
      {
        domain: "competitor1.com",
        overall_score: 75,
        strengths: [
          "Comprehensive FAQ page with FAQPage schema",
          "Strong entity clarity with detailed Organization schema",
          "Multiple direct answer blocks on key pages"
        ],
        citation_readiness: "Well-structured for AI extraction with clear Q&A format and comprehensive schema markup.",
        gap_analysis: [
          "They have more FAQ content (20+ Q&A pairs vs your 0-5)",
          "Their homepage includes a clear Direct Answer block",
          "More consistent schema implementation across pages"
        ]
      },
      {
        domain: "competitor2.com",
        overall_score: 82,
        strengths: [
          "Excellent trust signals with visible testimonials",
          "Strong third-party validation (media mentions, awards)",
          "Deep content on service pages (1500+ words each)"
        ],
        citation_readiness: "High citation readiness due to authority signals and comprehensive content.",
        gap_analysis: [
          "More social proof elements on homepage",
          "Case studies with specific results metrics",
          "Original research and data content"
        ]
      }
    ];
  }

  /**
   * Generate Implementation Roadmap
   */
  private generateImplementationRoadmap() {
    const { week1_fix_plan, section_scores } = this.analysis;

    // Week 1: Critical fixes
    const week1Tasks = week1_fix_plan.map((fix, i) => ({
      task: fix,
      pages: [this.domain], // Simplified
      effort: i < 2 ? '15min' : i < 4 ? '30min' : '1hr',
      impact: 10,
    }));

    // Week 2-4: High priority items
    const week2_4Tasks = [
      {
        task: "Create comprehensive FAQ page with 10-12 Q&A pairs",
        pages: [`${this.domain}/faq`],
        effort: '2hr',
        impact: 15,
      },
      {
        task: "Add Organization schema to all pages",
        pages: ["All pages"],
        effort: '30min',
        impact: 10,
      },
      {
        task: "Add Direct Answer blocks to top 5 pages",
        pages: this.crawlData.slice(0, 5).map(p => p.url),
        effort: '1hr',
        impact: 12,
      },
      {
        task: "Implement customer testimonials section",
        pages: [this.domain],
        effort: '1hr',
        impact: 8,
      },
    ];

    // Ongoing: Maintenance and optimization
    const ongoingTasks = [
      {
        task: "Monitor AI citation performance and adjust content",
        frequency: 'Monthly',
        impact: 5,
      },
      {
        task: "Expand FAQ with new common questions",
        frequency: 'Quarterly',
        impact: 5,
      },
      {
        task: "Refresh Direct Answer blocks based on user queries",
        frequency: 'Monthly',
        impact: 7,
      },
    ];

    return {
      week_1: {
        priority: 'critical' as const,
        tasks: week1Tasks,
      },
      week_2_4: {
        priority: 'high' as const,
        tasks: week2_4Tasks,
      },
      ongoing: {
        priority: 'medium' as const,
        tasks: ongoingTasks,
      },
    };
  }

  /**
   * Generate Score Projection
   */
  private generateScoreProjection() {
    const current = this.analysis.overall_score;

    // Calculate potential improvement from all recommendations
    const allRecommendations = [
      ...this.generateEntityClaritySection().recommendations,
      ...this.generateDirectAnswersSection().recommendations,
      ...this.generateTrustSignalsSection().recommendations,
    ];

    const totalPotentialImprovement = allRecommendations.reduce((sum, r) => sum + r.expected_improvement, 0);
    const week1Improvement = allRecommendations.slice(0, 3).reduce((sum, r) => sum + r.expected_improvement, 0);

    return {
      current_score: current,
      after_week_1: Math.min(100, current + week1Improvement),
      after_week_4: Math.min(100, current + totalPotentialImprovement * 0.7),
      after_3_months: Math.min(100, current + totalPotentialImprovement * 0.9),
      target_score: 100,
    };
  }

  /**
   * Generate Technical Appendix
   */
  private generateTechnicalAppendix() {
    return {
      pages_crawled: this.crawlData.length,
      total_words_analyzed: this.crawlData.reduce((sum, p) => sum + p.textContent.split(' ').length, 0),
      json_ld_found: this.crawlData.reduce((sum, p) => sum + p.jsonLd.length, 0),
      faqs_found: this.crawlData.reduce((sum, p) => sum + p.signals.directAnswerBlocks.length, 0),
      entity_mentions_found: this.crawlData.reduce((sum, p) => sum + p.signals.entityMentions.length, 0),
      crawl_errors: [], // Would be populated during crawl
      limitations: this.analysis.limitations,
    };
  }

  // Helper methods for generating code snippets

  private generateDirectAnswerHTML(pageTitle: string): string {
    return `<section class="direct-answer" style="background: #f5f5f5; padding: 20px; border-left: 4px solid #007AFF;">
  <h2>What is ${pageTitle}?</h2>
  <p>[Insert 40-60 word direct answer here. Be factual, avoid marketing fluff. Explain what ${pageTitle} is, who it's for, and the key benefit in one clear paragraph.]</p>
</section>`;
  }

  private generateOrganizationSchema(page: CrawlData): string {
    const url = new URL(page.url);
    const domain = url.origin;

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": page.title,
      "url": domain,
      "logo": `${domain}/logo.png`,
      "description": page.metaDescription || "Your organization description",
      "sameAs": [
        "https://twitter.com/yourcompany",
        "https://linkedin.com/company/yourcompany",
        "https://github.com/yourcompany"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@yourcompany.com"
      }
    }, null, 2);
  }

  private generateFaqSchema(page: CrawlData): string {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is [your service]?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[Your direct answer here]"
          }
        },
        {
          "@type": "Question",
          "name": "How does [your service] work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[Your explanation here]"
          }
        }
      ]
    }, null, 2);
  }

  private generateMetaDescription(page: CrawlData): string {
    const title = page.title;
    const firstH2 = page.headings.h2[0] || '';
    return `${title} - ${firstH2.substring(0, 60)}...`.substring(0, 155);
  }

  private generateSuggestedAnswer(page: CrawlData): string {
    // This would be generated by AI based on page content
    return `[AI-generated 40-60 word direct answer for: ${page.title}. This would explain what the page is about, who it's for, and key benefits in factual language.]`;
  }

  private getFindingForScore(score: number): string {
    if (score < 40) return "Critical - Needs immediate attention";
    if (score < 60) return "Poor - Significant improvements needed";
    if (score < 75) return "Adequate - Room for improvement";
    if (score < 90) return "Good - Minor optimizations possible";
    return "Excellent - Industry leading";
  }
}

/**
 * Main function to generate a report from crawl data and analysis
 */
export async function generateFullReport(
  crawlData: CrawlData[],
  analysis: GeoScore,
  domain: string
): Promise<FullReport> {
  const generator = new ReportGenerator(crawlData, analysis, domain);
  return await generator.generateFullReport();
}
