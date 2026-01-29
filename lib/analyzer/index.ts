/**
 * GEO Analysis Module
 *
 * Analyzes crawled website data using GLM-4.7-Flash
 */

import { callGLM47Flash } from "./glm-api.js";
import { GEO_ANALYSIS_PROMPT } from "./prompts.js";
import type { CrawlData, GeoScore } from "@/types/geo";

/**
 * Analyze crawl data and return GEO score
 */
export async function analyzeCrawlData(
  crawlData: CrawlData[]
): Promise<GeoScore> {
  if (crawlData.length === 0) {
    throw new Error("No crawl data to analyze");
  }

  console.log(`[Analyzer] Analyzing ${crawlData.length} pages with GLM-4.7-Flash...`);

  // Prepare data for AI - send relevant signals
  const summary = crawlData.map((page) => ({
    url: page.url,
    title: page.title,
    metaDescription: page.metaDescription,
    headings: page.headings,
    textContent: page.textContent.slice(0, 2000), // First 2000 chars for context
    entityMentions: page.signals.entityMentions,
    locationMentions: page.signals.locationMentions,
    hedgingWordCount: page.signals.hedgingWords,
    directAnswerBlocks: page.signals.directAnswerBlocks,
    hasJsonLd: page.jsonLd.length > 0,
    jsonLdTypes: page.jsonLd
      .map((ld: any) => ld["@type"])
      .filter(Boolean)
      .flat(),
  }));

  // Call GLM-4.7-Flash
  const response = await callGLM47Flash(
    [
      {
        role: "system",
        content: GEO_ANALYSIS_PROMPT,
      },
      {
        role: "user",
        content: `Analyze this website for AI recommendation readiness:\n\n${JSON.stringify(summary, null, 2)}`,
      },
    ],
    { temperature: 0.3, maxTokens: 4096 }
  );

  // Parse response
  let result: any;
  try {
    result = JSON.parse(response.choices?.[0]?.message?.content || "{}");
  } catch (e) {
    console.error("[Analyzer] Failed to parse GLM response:", response.choices?.[0]?.message?.content);
    throw new Error("Failed to parse AI response");
  }

  console.log(`[Analyzer] Score: ${result.overall_score}/100, Tier: ${result.tier}`);

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
    extracted_faqs: crawlData.flatMap((p) => p.signals.directAnswerBlocks),
    extracted_json_ld: crawlData.flatMap((p) => p.jsonLd),
  };
}

// Export types for external use
export type { GeoScore } from "@/types/geo";
export type { CrawlData } from "@/types/geo";
