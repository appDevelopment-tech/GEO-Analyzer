import OpenAI from "openai";
import {
  CrawlData,
  GeoScore,
  AIQuerySimulation,
  RealCompetitor,
  CopyBlock,
} from "../types/geo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCORING_PROMPT = `Score a website's AI-citation readiness. Be conservative — missing evidence = risk. Return JSON only.

JSON shape:
{"overall_score":0-100,"tier":"Invisible to AI|Weak / inconsistent|Functional AI presence|AI-reference capable|Primary citation candidate","section_scores":{"entity_clarity":0-100,"direct_answers":0-100,"trust_signals":0-100,"competitive_positioning":0-100,"technical_accessibility":0-100},"top_ai_hesitations":[{"issue":"","why_ai_hesitates":"","evidence":[""],"affected_urls":[""]}],"week1_fix_plan":["max 5"],"limitations":[""],"ai_query_simulations":[{"query":"","mentioned":true,"position":1,"snippet":"2-3 sentences","competitors_mentioned":["real names"]}],"real_competitors":[{"name":"","url":"","ai_readiness_estimate":0-100,"strengths":["max 2"]}],"copy_blocks":[{"type":"meta_description|faq_section|about_paragraph|page_title","page_url":"","current":"","suggested":"","why":""}]}

Rules:
- ai_query_simulations: 5 queries (2 comparison, 1 info, 1 review, 1 how-to). Real competitor names. Honest about whether site gets cited.
- real_competitors: 3-5 real businesses/sites in niche.
- copy_blocks: 3-5. For faq_section include "questions":[{"q":"","a":""}] (3-5 pairs).
- Weights: entity_clarity 30%, direct_answers 30%, trust_signals 20%, competitive_positioning 10%, technical_accessibility 10%.
- Tiers: 0-39 Invisible, 40-59 Weak, 60-74 Functional, 75-89 Reference-capable, 90-100 Primary citation.
- top_ai_hesitations: max 3, cite evidence.`;

/** Trim text to a word limit */
function trimWords(text: string, max: number): string {
  const words = text.split(/\s+/);
  return words.length <= max ? text : words.slice(0, max).join(" ") + "…";
}

/** Compact JSON-LD: keep only @type, name, description, url (drop deep nesting) */
function compactJsonLd(items: any[]): any[] {
  return items.slice(0, 3).map((item) => {
    const pick: Record<string, any> = {};
    const src = item["@graph"] ? item["@graph"][0] : item;
    if (!src || typeof src !== "object") return item;
    for (const k of [
      "@type",
      "name",
      "description",
      "url",
      "address",
      "telephone",
      "sameAs",
      "aggregateRating",
    ]) {
      if (src[k] !== undefined) pick[k] = src[k];
    }
    return pick;
  });
}

export async function analyzeWithOpenAI(
  crawlData: CrawlData[],
): Promise<GeoScore> {
  try {
    // Build a compact payload — minimal tokens for fast AI response
    const summary = crawlData.map((page) => ({
      url: page.url,
      title: page.title,
      meta: page.metaDescription,
      h1: page.headings.h1.slice(0, 2),
      h2: page.headings.h2.slice(0, 4),
      entities: page.signals.entityMentions.slice(0, 3),
      locations: page.signals.locationMentions.slice(0, 2),
      hedging: page.signals.hedgingWords,
      answers: page.signals.directAnswerBlocks.slice(0, 2),
      jsonLd: compactJsonLd(page.jsonLd),
      text: trimWords(page.textContent, 400),
    }));

    // Detect if fetch was blocked (empty data)
    const hasContent = summary.some(
      (p) => p.text.length > 50 || (p.title && p.title.length > 0),
    );
    const siteDomain = (() => {
      try {
        return new URL(summary[0]?.url || "").hostname;
      } catch {
        return summary[0]?.url || "unknown";
      }
    })();

    const userMsg = hasContent
      ? JSON.stringify(summary)
      : `Domain: ${siteDomain}\nURL: ${summary[0]?.url}\n\nThe site blocked our fetch (403/timeout). Analyze using your training knowledge about this domain. If you recognize it, provide a real analysis. If not, infer from the domain name and score conservatively. Add "Live crawl data was unavailable" to limitations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SCORING_PROMPT },
        { role: "user", content: userMsg },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Collect all FAQs and JSON-LD from crawled pages
    const allFaqs = crawlData.flatMap((p) => p.signals.directAnswerBlocks);
    const allJsonLd = crawlData.flatMap((p) => p.jsonLd);

    // AI query simulations — now LLM-generated (not heuristic)
    const aiQuerySimulations: AIQuerySimulation[] = (
      result.ai_query_simulations || []
    ).map((sim: any) => ({
      query: sim.query || "",
      mentioned: !!sim.mentioned,
      position: sim.position ?? null,
      snippet: sim.snippet || "",
      competitors_mentioned: Array.isArray(sim.competitors_mentioned)
        ? sim.competitors_mentioned
        : [],
    }));

    // Real competitors — LLM-identified
    const realCompetitors: RealCompetitor[] = (
      result.real_competitors || []
    ).map((c: any) => ({
      name: c.name || "",
      url: c.url || undefined,
      ai_readiness_estimate: c.ai_readiness_estimate || 0,
      strengths: Array.isArray(c.strengths) ? c.strengths : [],
    }));

    // Copy blocks — LLM-generated ready-to-paste content
    const copyBlocks: CopyBlock[] = (result.copy_blocks || []).map(
      (b: any) => ({
        type: b.type || "meta_description",
        page_url: b.page_url || undefined,
        current: b.current || undefined,
        suggested: b.suggested || "",
        why: b.why || "",
        questions: Array.isArray(b.questions) ? b.questions : undefined,
      }),
    );

    return {
      overall_score: result.overall_score || 0,
      tier: result.tier || "Invisible to AI",
      section_scores: result.section_scores || {
        entity_clarity: 0,
        direct_answers: 0,
        trust_signals: 0,
        competitive_positioning: 0,
        technical_accessibility: 0,
      },
      top_ai_hesitations: result.top_ai_hesitations || [],
      week1_fix_plan: result.week1_fix_plan || [],
      limitations: result.limitations || [],
      extracted_faqs: allFaqs,
      extracted_json_ld: allJsonLd,
      ai_query_simulations: aiQuerySimulations,
      real_competitors: realCompetitors,
      copy_blocks: copyBlocks,
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw new Error("Failed to analyze website with AI");
  }
}
