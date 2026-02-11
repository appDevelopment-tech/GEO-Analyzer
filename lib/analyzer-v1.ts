import OpenAI from "openai";
import { CrawlData, GeoScore, AIQuerySimulation, RealCompetitor, CopyBlock } from "@/types/geo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCORING_PROMPT = `You are evaluating whether an AI assistant could safely recommend this website to a real user.

You must score conservatively. If evidence is missing, assume risk. Every claim must cite extracted evidence or note uncertainty.

Analyze the provided website data and return a JSON response following this EXACT structure:

{
  "overall_score": <number 0-100>,
  "tier": <string: one of "Invisible to AI", "Weak / inconsistent", "Functional AI presence", "AI-reference capable", "Primary citation candidate">,
  "section_scores": {
    "entity_clarity": <number 0-100>,
    "direct_answers": <number 0-100>,
    "trust_signals": <number 0-100>,
    "competitive_positioning": <number 0-100>,
    "technical_accessibility": <number 0-100>
  },
  "top_ai_hesitations": [
    {
      "issue": <string>,
      "why_ai_hesitates": <string>,
      "evidence": [<strings>],
      "affected_urls": [<strings>]
    }
  ],
  "week1_fix_plan": [<strings, max 5>],
  "limitations": [<strings>],

  "ai_query_simulations": [
    {
      "query": <string: a realistic search query a user might ask>,
      "mentioned": <boolean: would an AI assistant cite this website in its response?>,
      "position": <number 1-4 if mentioned, null if not>,
      "snippet": <string: a realistic 2-3 sentence AI response to this query — if mentioned, naturally weave in the site; if not, show what AI would say instead>,
      "competitors_mentioned": [<strings: real competitor names that AI would cite instead, max 3>]
    }
  ],

  "real_competitors": [
    {
      "name": <string: real business/site name>,
      "url": <string: their website URL>,
      "ai_readiness_estimate": <number 0-100>,
      "strengths": [<strings: what they do better for AI visibility, max 2>]
    }
  ],

  "copy_blocks": [
    {
      "type": <string: one of "meta_description", "faq_section", "about_paragraph", "page_title">,
      "page_url": <string: which page this applies to>,
      "current": <string: what's currently on the site (if available)>,
      "suggested": <string: optimized replacement text ready to paste>,
      "why": <string: why this change improves AI citation chances>
    }
  ]
}

IMPORTANT INSTRUCTIONS FOR EACH SECTION:

ai_query_simulations (generate exactly 5):
- Create 5 REALISTIC queries users would ask that relate to this business/site niche
- Mix query types: 2 comparison ("best X in Y"), 1 informational ("what is X"), 1 review ("X reviews"), 1 direct ("how to X")
- For "mentioned": evaluate honestly — would a well-informed AI actually cite this site?
- For "snippet": write what an AI assistant would ACTUALLY respond. Be realistic. If the site isn't mentioned, show the competitors it would mention instead.
- For "competitors_mentioned": use REAL business/site names that compete in this space. Not generic phrases.

real_competitors (identify 3-5):
- Identify REAL competing businesses or authoritative sites in this niche
- Use your training knowledge — these should be actual sites a user would find
- ai_readiness_estimate: how well-optimized THEY are for AI citation (0-100)
- strengths: what specifically they do better (structured data, authority, content depth, etc.)

copy_blocks (generate 3-5):
- meta_description: Rewrite the homepage meta description optimized for AI citation (130-155 chars)
- faq_section: Generate 3-5 Q&A pairs an AI would use as citation sources
- about_paragraph: Entity-rich paragraph that clearly establishes who/what/where/credentials
- page_title: Optimized title tag if current one is weak
- "current" should reflect what's ACTUALLY on the site. "suggested" should be ready to paste.

Scoring weights:
- Entity Clarity: 30%
- Direct Answers: 30%
- Trust & Specificity: 20%
- Competitive Positioning: 10%
- Technical Accessibility: 10%

Tier mapping:
- 0-39: "Invisible to AI"
- 40-59: "Weak / inconsistent"
- 60-74: "Functional AI presence"
- 75-89: "AI-reference capable"
- 90-100: "Primary citation candidate"

Be specific and evidence-based. Focus on the top 3 AI hesitations.`;

export async function analyzeWithOpenAI(
  crawlData: CrawlData[],
): Promise<GeoScore> {
  try {
    const summary = crawlData.map((page) => ({
      url: page.url,
      title: page.title,
      metaDescription: page.metaDescription,
      headings: page.headings,
      entityMentions: page.signals.entityMentions,
      locationMentions: page.signals.locationMentions,
      hedgingWordCount: page.signals.hedgingWords,
      directAnswerBlocks: page.signals.directAnswerBlocks,
      hasJsonLd: page.jsonLd.length > 0,
      jsonLd: page.jsonLd,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: SCORING_PROMPT,
        },
        {
          role: "user",
          content: `Analyze this website data:\n\n${JSON.stringify(summary, null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
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
