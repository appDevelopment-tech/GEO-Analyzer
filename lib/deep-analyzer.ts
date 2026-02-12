import OpenAI from "openai";
import { CrawlData, ReportDetails, GeoScore } from "@/types/geo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Trim text to a word limit */
function trimWords(text: string, max: number): string {
  const words = text.split(/\s+/);
  return words.length <= max ? text : words.slice(0, max).join(" ") + "…";
}

/** Compact JSON-LD for prompt inclusion */
function compactJsonLd(items: any[]): any[] {
  return items.slice(0, 3).map((item) => {
    const pick: Record<string, any> = {};
    const src = item["@graph"] ? item["@graph"][0] : item;
    if (!src || typeof src !== "object") return item;
    for (const k of ["@type", "name", "description", "url", "address", "telephone", "sameAs", "aggregateRating"]) {
      if (src[k] !== undefined) pick[k] = src[k];
    }
    return pick;
  });
}

const DEEP_ANALYSIS_PROMPT = `You are an expert AI visibility consultant. Analyze multiple pages of a website and produce a comprehensive, actionable report to maximize their visibility in AI systems (ChatGPT, Perplexity, Claude, Gemini).

Return JSON only. Be specific, practical, and use real data from the crawled pages. Every suggestion must be immediately actionable with exact text/code.

JSON shape:
{
  "pages_analyzed": [{
    "url": "",
    "page_type": "homepage|service|about|faq|pricing|contact|product|other",
    "title": "",
    "meta_description": "",
    "page_score": 0-100,
    "scores": {
      "entity_clarity": 0-100,
      "direct_answers": 0-100,
      "trust_signals": 0-100,
      "structured_data": 0-100
    },
    "ai_snapshot": "2-3 sentences: how AI currently sees this page",
    "dominant_gap": "entity_clarity|direct_answers|trust_signals|structured_data|content_depth",
    "fixes": [{
      "priority": "critical|high|medium",
      "action": "specific action",
      "current_state": "what exists now",
      "suggested_content": "exact text or code to add",
      "impact": "why this matters for AI citation"
    }],
    "schema_recommendations": [{
      "schema_type": "FAQPage|LocalBusiness|Organization|Service|Product|etc",
      "exists": false,
      "json_ld_snippet": "complete ready-to-paste JSON-LD"
    }]
  }],
  "site_wide_issues": [{
    "issue": "",
    "severity": "critical|high|medium",
    "affected_pages": ["urls"],
    "fix": "specific fix"
  }],
  "content_gaps": [{
    "gap": "what's missing",
    "opportunity": "what could be gained",
    "suggested_queries": ["AI queries this would help capture"]
  }],
  "content_strategy": [{
    "priority": 1,
    "title": "strategy title",
    "description": "what to do",
    "target_queries": ["queries this helps with"],
    "content_outline": "what to write, section by section",
    "placement": "where to add it on the site",
    "expected_impact": "what improvement to expect"
  }],
  "internal_linking_recommendations": [{
    "from_page": "url",
    "to_page": "url",
    "anchor_text": "suggested anchor text",
    "reason": "why this helps AI understand your site"
  }],
  "schema_coverage": {
    "existing_types": ["types found"],
    "missing_recommended": ["types that should be added"],
    "overall_schema_score": 0-100
  },
  "implementation_roadmap": [{
    "week": 1,
    "tasks": [{
      "task": "specific task",
      "page": "which page",
      "effort": "low|medium|high",
      "impact": "low|medium|high"
    }]
  }]
}

Rules:
- For EACH page, provide 3-5 specific fixes with exact suggested content (real text, not placeholders).
- schema_recommendations: provide COMPLETE, valid JSON-LD snippets ready to paste into <script type="application/ld+json"> tags. Use real data from the crawled page.
- content_gaps: identify 3-5 content gaps where new pages or sections would capture AI queries.
- content_strategy: 3-5 strategies ordered by impact. Include specific content outlines.
- implementation_roadmap: 4 weeks, most impactful items first. Each week has 3-5 tasks.
- site_wide_issues: issues that affect multiple pages (e.g., no consistent entity definition, missing schema on all pages).
- internal_linking: suggest 3-5 cross-links between the analyzed pages that help AI understand relationships.
- Be conservative with scores — missing evidence = low score.
- Every fix must include EXACT text or code to implement, not vague advice.`;

/**
 * Run the deep multi-page analysis after payment.
 * This produces the rich report_details stored in Supabase.
 *
 * @param crawlData - Array of crawled pages (typically 3)
 * @param baseScore - The original GeoScore from the free analysis
 * @param domain - The domain being analyzed
 */
export async function analyzeDeep(
  crawlData: CrawlData[],
  baseScore: GeoScore,
  domain: string,
): Promise<ReportDetails> {
  // Build a rich payload with all page data
  const pageSummaries = crawlData.map((page) => ({
    url: page.url,
    title: page.title,
    meta: page.metaDescription,
    h1: page.headings.h1.slice(0, 3),
    h2: page.headings.h2.slice(0, 6),
    h3: page.headings.h3.slice(0, 6),
    entities: page.signals.entityMentions.slice(0, 5),
    locations: page.signals.locationMentions.slice(0, 3),
    hedging: page.signals.hedgingWords,
    answers: page.signals.directAnswerBlocks.slice(0, 3),
    jsonLd: compactJsonLd(page.jsonLd),
    text: trimWords(page.textContent, 600),
  }));

  const context = {
    domain,
    overall_score: baseScore.overall_score,
    tier: baseScore.tier,
    section_scores: baseScore.section_scores,
    top_issues: baseScore.top_ai_hesitations?.map((h) => h.issue) || [],
    pages: pageSummaries,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: DEEP_ANALYSIS_PROMPT },
      { role: "user", content: JSON.stringify(context) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  // Normalize and validate the response
  const reportDetails: ReportDetails = {
    pages_analyzed: (result.pages_analyzed || []).map((p: any) => ({
      url: p.url || "",
      page_type: p.page_type || "other",
      title: p.title || "",
      meta_description: p.meta_description || "",
      page_score: p.page_score || 0,
      scores: {
        entity_clarity: p.scores?.entity_clarity || 0,
        direct_answers: p.scores?.direct_answers || 0,
        trust_signals: p.scores?.trust_signals || 0,
        structured_data: p.scores?.structured_data || 0,
      },
      ai_snapshot: p.ai_snapshot || "",
      dominant_gap: p.dominant_gap || "content_depth",
      fixes: (p.fixes || []).map((f: any) => ({
        priority: f.priority || "medium",
        action: f.action || "",
        current_state: f.current_state || "",
        suggested_content: f.suggested_content || "",
        impact: f.impact || "",
      })),
      schema_recommendations: (p.schema_recommendations || []).map((s: any) => ({
        schema_type: s.schema_type || "",
        exists: !!s.exists,
        json_ld_snippet: s.json_ld_snippet || "",
      })),
    })),
    total_pages_crawled: crawlData.length,

    site_wide_issues: (result.site_wide_issues || []).map((i: any) => ({
      issue: i.issue || "",
      severity: i.severity || "medium",
      affected_pages: i.affected_pages || [],
      fix: i.fix || "",
    })),

    content_gaps: (result.content_gaps || []).map((g: any) => ({
      gap: g.gap || "",
      opportunity: g.opportunity || "",
      suggested_queries: g.suggested_queries || [],
    })),

    content_strategy: (result.content_strategy || []).map((s: any) => ({
      priority: s.priority || 1,
      title: s.title || "",
      description: s.description || "",
      target_queries: s.target_queries || [],
      content_outline: s.content_outline || "",
      placement: s.placement || "",
      expected_impact: s.expected_impact || "",
    })),

    internal_linking_recommendations: (result.internal_linking_recommendations || []).map((l: any) => ({
      from_page: l.from_page || "",
      to_page: l.to_page || "",
      anchor_text: l.anchor_text || "",
      reason: l.reason || "",
    })),

    schema_coverage: {
      existing_types: result.schema_coverage?.existing_types || [],
      missing_recommended: result.schema_coverage?.missing_recommended || [],
      overall_schema_score: result.schema_coverage?.overall_schema_score || 0,
    },

    implementation_roadmap: (result.implementation_roadmap || []).map((w: any) => ({
      week: w.week || 1,
      tasks: (w.tasks || []).map((t: any) => ({
        task: t.task || "",
        page: t.page || "",
        effort: t.effort || "medium",
        impact: t.impact || "medium",
      })),
    })),
  };

  return reportDetails;
}
