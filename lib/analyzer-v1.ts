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

/**
 * Heuristic-based AI query simulation — no extra LLM calls.
 * Generates realistic queries from crawl data and estimates
 * whether AI would cite the site based on existing scores.
 */
function simulateAIQueries(
  crawlData: CrawlData[],
  domain: string,
  sectionScores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    competitive_positioning: number;
    technical_accessibility: number;
  },
  overallScore: number,
): AIQuerySimulation[] {
  try {
    const domainClean = domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
    const brandName = domainClean.split(".")[0];
    const brandDisplay =
      brandName.charAt(0).toUpperCase() + brandName.slice(1);

    // Extract signals from crawl data
    const allHeadings = crawlData.flatMap((p) =>
      [...p.headings.h1, ...p.headings.h2].filter(Boolean),
    );
    const entities = crawlData.flatMap((p) => p.signals.entityMentions);
    const locations = crawlData.flatMap((p) => p.signals.locationMentions);
    const hasJsonLd = crawlData.some((p) => p.jsonLd.length > 0);
    const hasFaqs = crawlData.some(
      (p) => p.signals.directAnswerBlocks.length > 0,
    );
    const title = crawlData[0]?.title || "";
    const meta = crawlData[0]?.metaDescription || "";

    // Extract key terms from title and headings
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
      "for", "of", "with", "by", "from", "is", "are", "was", "were",
      "be", "been", "being", "have", "has", "had", "do", "does", "did",
      "will", "would", "could", "should", "may", "might", "can", "shall",
      "it", "its", "this", "that", "these", "those", "i", "we", "you",
      "he", "she", "they", "me", "us", "him", "her", "them", "my", "our",
      "your", "his", "their", "what", "which", "who", "whom", "how",
      "when", "where", "why", "all", "each", "every", "both", "few",
      "more", "most", "other", "some", "such", "no", "not", "only",
      "own", "same", "so", "than", "too", "very", "just", "about",
      "home", "page", "welcome", "official", "website", "site",
    ]);

    const extractTerms = (text: string): string[] =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));

    const titleTerms = extractTerms(title);
    const headingTerms = allHeadings.flatMap(extractTerms);
    const metaTerms = extractTerms(meta);

    // Find most common meaningful terms (likely industry/service terms)
    const termFreq: Record<string, number> = {};
    [...titleTerms, ...titleTerms, ...headingTerms, ...metaTerms].forEach(
      (t) => {
        termFreq[t] = (termFreq[t] || 0) + 1;
      },
    );
    const topTerms = Object.entries(termFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);

    const location = locations[0] || "";
    const primaryService = topTerms.slice(0, 2).join(" ") || "services";
    const secondaryService = topTerms.slice(2, 4).join(" ") || "";

    // Build 5 queries from templates
    const queryTemplates = [
      {
        query: location
          ? `best ${primaryService} in ${location}`
          : `best ${primaryService} recommendations`,
        type: "comparison" as const,
        relevantScore: sectionScores.competitive_positioning,
      },
      {
        query: `what is ${topTerms[0] || primaryService} and how does it work`,
        type: "informational" as const,
        relevantScore: sectionScores.direct_answers,
      },
      {
        query: secondaryService
          ? `${primaryService} vs ${secondaryService} which is better`
          : `how to choose the right ${primaryService}`,
        type: "comparison" as const,
        relevantScore: sectionScores.entity_clarity,
      },
      {
        query: location
          ? `${primaryService} reviews ${location}`
          : `top rated ${primaryService} ${new Date().getFullYear()}`,
        type: "review" as const,
        relevantScore: sectionScores.trust_signals,
      },
      {
        query:
          allHeadings.find(
            (h) =>
              h.toLowerCase().includes("how") ||
              h.toLowerCase().includes("what") ||
              h.toLowerCase().includes("why"),
          ) || `how to get started with ${primaryService}`,
        type: "informational" as const,
        relevantScore: sectionScores.direct_answers,
      },
    ];

    // Estimate citation for each query
    return queryTemplates.map((qt, index) => {
      // Citation probability based on scores
      const citationScore =
        qt.relevantScore * 0.4 +
        sectionScores.entity_clarity * 0.25 +
        overallScore * 0.2 +
        (hasJsonLd ? 10 : 0) +
        (hasFaqs ? 5 : 0);

      // Threshold varies by query type to create realistic mix
      const thresholds: Record<string, number> = {
        comparison: 65,
        informational: 55,
        review: 70,
      };
      const threshold = thresholds[qt.type] || 60;
      const mentioned = citationScore > threshold;

      // Position: better scores = higher position
      let position: number | null = null;
      if (mentioned) {
        if (citationScore > 80) position = 1;
        else if (citationScore > 70) position = 2;
        else if (citationScore > 60) position = 3;
        else position = 4;
      }

      // Generate snippet based on whether mentioned
      const snippet = mentioned
        ? `Based on available information, ${brandDisplay} (${domainClean}) offers ${primaryService}${location ? ` in ${location}` : ""}. ${
            entities[0] || `The site provides relevant ${primaryService} content`
          }${hasJsonLd ? " with structured data that helps verify their offerings." : "."}`
        : qt.type === "comparison"
          ? `There are several reputable ${primaryService} providers${location ? ` in ${location}` : ""} to consider. When evaluating options, look for clear credentials, verified reviews, and transparent pricing. ${domainClean} did not surface as a top recommendation for this query.`
          : qt.type === "review"
            ? `When looking for trusted ${primaryService} providers, AI assistants prioritize sites with clear trust signals, structured data, and verifiable credentials. ${domainClean} was not among the recommended results for this search.`
            : `To understand ${topTerms[0] || primaryService}, it helps to find sources with direct, authoritative answers. AI assistants prefer sites that clearly define what they offer and back it with evidence. ${domainClean} was not cited in this response.`;

      // Infer competitor-style placeholders (generic, industry-appropriate)
      const competitorPhrases = mentioned
        ? []
        : [
            `Top ${primaryService} directories`,
            `Industry authority sites`,
            ...(location ? [`Local ${location} listings`] : []),
          ].slice(0, index === 0 ? 3 : 2);

      return {
        query: qt.query,
        mentioned,
        position,
        snippet,
        competitors_mentioned: competitorPhrases,
      };
    });
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

    // Simulate AI queries to check if site gets cited (heuristic — no extra LLM calls)
    const domain = crawlData[0]?.url || "";
    const scores = result.section_scores || {
      entity_clarity: 0,
      direct_answers: 0,
      trust_signals: 0,
      competitive_positioning: 0,
      technical_accessibility: 0,
    };
    const aiQuerySimulations = simulateAIQueries(
      crawlData,
      domain,
      scores,
      result.overall_score || 0,
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
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw new Error("Failed to analyze website with AI");
  }
}
