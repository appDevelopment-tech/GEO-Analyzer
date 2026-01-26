import OpenAI from "openai";
import { CrawlData, GeoScore } from "@/types/geo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCORING_PROMPT = `You are evaluating whether an AI assistant could safely recommend this website to a real user.

You must score conservatively. If evidence is missing, assume risk. Every claim must cite extracted evidence or note uncertainty.

Analyze the provided website data and return a JSON response following this structure:

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
  "limitations": [<strings>]
}

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
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw new Error("Failed to analyze website with AI");
  }
}
