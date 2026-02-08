import OpenAI from "openai";
import { CrawlData, GeoScore, AIQuerySimulation } from "@/types/geo";

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

async function simulateAIQueries(
  crawlData: CrawlData[],
  domain: string,
): Promise<AIQuerySimulation[]> {
  try {
    // Extract domain name without protocol/www for matching
    const domainClean = domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
    const brandName = domainClean.split(".")[0];

    const siteSummary = crawlData.slice(0, 3).map((p) => ({
      title: p.title,
      metaDescription: p.metaDescription,
      headings: p.headings.h1.concat(p.headings.h2).slice(0, 10),
      entityMentions: p.signals.entityMentions,
    }));

    // Call 1: Generate 5 realistic queries
    const queryGenResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You generate realistic search queries that a user might ask an AI assistant. Based on the website data provided, generate exactly 5 queries where this website SHOULD be a relevant result. Mix query types: informational ("what is..."), comparison ("best X for Y"), local ("X near Z"), and transactional ("how to hire X"). Return a JSON array of 5 query strings. Example: ["best plumbers in Austin TX", "how to fix a leaky faucet", ...]`,
        },
        {
          role: "user",
          content: `Website: ${domain}\n\nSite data:\n${JSON.stringify(siteSummary, null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const queriesResult = JSON.parse(
      queryGenResponse.choices[0].message.content || '{"queries":[]}',
    );
    const queries: string[] = (
      queriesResult.queries || Object.values(queriesResult)
    )
      .flat()
      .slice(0, 5);

    if (queries.length === 0) return [];

    // Call 2: Simulate AI responses for all queries at once
    const simResponse = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You are simulating how an AI assistant would answer user queries. For each query below, write a natural response as if you're answering a real user. Be realistic — only mention "${domainClean}" or "${brandName}" if the website data genuinely supports it. Don't force mentions.

After writing each response, analyze it and return structured JSON:
{
  "results": [
    {
      "query": "<the query>",
      "response_snippet": "<your first 2-3 sentences of the answer>",
      "mentioned": <true if you naturally mentioned the domain or brand>,
      "position": <1-based position where it was mentioned, or null>,
      "competitors_mentioned": ["<other brands/sites you mentioned>"]
    }
  ]
}

Website being evaluated: ${domain}
Website data: ${JSON.stringify(siteSummary, null, 2)}`,
        },
        {
          role: "user",
          content: `Simulate responses for these queries:\n${queries.map((q, i) => `${i + 1}. ${q}`).join("\n")}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const simResult = JSON.parse(
      simResponse.choices[0].message.content || '{"results":[]}',
    );
    const results = simResult.results || [];

    return results.map((r: any) => ({
      query: r.query || "",
      mentioned: Boolean(r.mentioned),
      position: r.position ?? null,
      snippet: r.response_snippet || r.snippet || "",
      competitors_mentioned: r.competitors_mentioned || [],
    }));
  } catch (error) {
    console.error("AI query simulation failed:", error);
    return [];
  }
}

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

    // Simulate AI queries to check if site gets cited
    const domain = crawlData[0]?.url || "";
    const aiQuerySimulations = await simulateAIQueries(crawlData, domain);

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
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw new Error("Failed to analyze website with AI");
  }
}
