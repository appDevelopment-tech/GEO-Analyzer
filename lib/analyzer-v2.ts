import { CrawlData, GeoScore, PageRemediation } from "@/types/geo";

const Z_AI_API_KEY = process.env.Z_AI_GLM_API_KEY;
const Z_AI_API_URL = "https://api.z.ai/api/paas/v4/chat/completions";

async function callGLM(
  messages: Array<{ role: string; content: string }>,
): Promise<any> {
  if (!Z_AI_API_KEY) {
    throw new Error("Z_AI_GLM_API_KEY is not set");
  }

  const response = await fetch(Z_AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Z_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4.7-flash",
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

const GEO_AEO_PER_PAGE_REMEDIATION_PROMPT_V3_1 = `
You are an expert GEO/AEO remediation engine.

You will receive a SINGLE page payload:

- site_context (optional): {
    industry,
    target_audience,
    tone_preference: "formal" | "conversational" | "technical",
    existing_schemas: [string] (optional),
    existing_faq_topics: [string] (optional),
    scoring_mode: "heuristic" | "omit" (optional, default "heuristic")
  }
- page: {
    url,
    title (optional),
    meta_description (optional),
    h1 (optional),
    headings (optional array),
    main_text_excerpt (string),
    json_ld_blocks (optional array of raw JSON-LD strings),
    notes (optional string: crawler quirks, missing sections, extraction limits)
  }

Your job:
Produce a client-ready remediation plan for THIS page ONLY:

- what to change
- exact copy to add (Direct Answer + FAQs + microcopy where relevant)
- exact placement (DOM anchor or Wix insertion location)
- JSON-LD examples (ONLY when you can do so without inventing facts)

Return ONLY valid JSON. No markdown. No commentary outside JSON.

# ========================
HARD CONSTRAINTS

1. MAX 5 recommended_changes total, ordered by impact (highest first).
2. Each change MUST include priority: "high" | "medium" | "low".
3. Do NOT invent:
    - credentials, awards, certifications, reviews, statistics
    - addresses, phone numbers, staff names
    - legal claims like "guaranteed approval"
4. If a fact (legal org name, address, phone) is missing, OMIT it from JSON-LD rather than inventing it.
5. Placement MUST be one of:
    A) DOM anchor: "after <h1>" | "before first <h2>" | "after section '<H2 text>'"
    B) Semantic anchor: "immediately after hero section" | "top of main content column"
    C) Wix insertion: "Wix Custom Code — Head (page-level)" | "Wix Custom Code — Body End (page-level)"

OUTPUT BUDGET:

- Keep total JSON output under ~900 tokens.
- Keep ai_hesitation <= 25 words.
- Keep each change's exact_example_text concise and implementation-ready.

# ========================
AVOID (NEGATIVE EXAMPLES)

AVOID:

- Direct Answers that sound like marketing or promises (e.g., "We are the best…", "Guaranteed results…").
- FAQs that are sales scripts (e.g., "Why choose us?" "How amazing are you?").
- JSON-LD with placeholders (e.g., "YOUR_COMPANY_NAME", lorem ipsum, fake address/phone).
- Vague placement (e.g., "somewhere near the top", "around the content").

# ========================
EDGE CASES

- If page.h1 is missing, use placement "top of main content column" instead of "after <h1>".
- If the page already has a strong Direct Answer + FAQs + valid JSON-LD, return 1–2 minor improvements only (do not force 5 changes).
- If main_text_excerpt is clearly truncated, keep Direct Answer conservative and avoid specific claims.

# ========================
TONE INTEGRATION

If tone_preference is provided:

- formal: no contractions, precise phrasing, professional tone
- conversational: simpler words, contractions allowed, shorter sentences
- technical: domain jargon acceptable, assumes reader competence

Apply tone_preference to Direct Answer, FAQs, and microcopy.

# ========================
CROSS-PAGE CONSISTENCY

If existing_faq_topics is provided:

- Do NOT repeat those topics/questions on this page's FAQs.

If existing_schemas is provided:

- Prefer recommending missing schemas; avoid redundant duplicates unless page-specific.

# ========================
PAGE SCORING (CALIBRATED)

If scoring_mode is "omit", exclude page_score entirely (do not output it).
Otherwise scoring_mode="heuristic":
Compute a conservative page_score (0–100) as a heuristic using:

- direct_answer_quality: 35%
- entity_clarity: 25%
- trust_signals: 20%
- structured_data_quality: 20%

Calibration guardrails:

- If Direct Answer is missing: page_score MUST be <= 70.
- If JSON-LD is missing AND FAQs are missing: page_score MUST be <= 60.
- If 2+ major categories are missing: page_score MUST be <= 55.

dominant_gap MUST be one of:
"direct_answer_quality" | "entity_clarity" | "trust_signals" | "structured_data_quality"

# ========================
DIRECT ANSWER RULES

If you recommend a Direct Answer:

- 40–60 words
- First sentence defines the topic plainly
- Neutral, factual tone; no marketing
- Must be extractable as-is

# ========================
FAQ RULES (FORMAT DEFINED)

If you recommend FAQs:

- 2–4 Q&As
- Each answer 2–4 sentences
- Must not restate the Direct Answer definition if Direct Answer is also recommended

FAQ FORMAT in exact_example_text (MUST follow exactly):
Q: <question>?
A: <2–4 sentence answer>

(blank line)

Q: <question>?
A: <2–4 sentence answer>

# ========================
JSON-LD RULES (+ VALIDITY REMINDER)

If you recommend schema:

- Provide FULL JSON-LD as a JSON string in example_json_ld.
- Keep it minimal and correct.
- Use only safe types for a single page:
    - WebPage (almost always)
    - Article (if page reads like an article/blog)
    - FAQPage (only if you also recommend on-page FAQs)
    - Service (if page is clearly a service page)
    - Organization/WebSite ONLY if this page is homepage AND org identity is explicitly present in excerpt

Do not fabricate addresses/phones/names.
If missing, omit those fields.

Ensure the JSON-LD you output is valid JSON and matches [schema.org](http://schema.org/) types.

For change_type="json_ld":

- exact_example_text MUST be <= 20 words instruction
- example_json_ld contains the full JSON-LD string

# ========================
OUTPUT SCHEMA (STRICT)

If scoring_mode="omit":
{
  "url": "<page.url>",
  "page_type": "homepage" | "service" | "article" | "category" | "other",
  "diagnosis": {
    "dominant_gap": "direct_answer_quality" | "entity_clarity" | "trust_signals" | "structured_data_quality",
    "ai_hesitation": "<max 25 words>"
  },
  "recommended_changes": [
    {
      "priority": "high" | "medium" | "low",
      "change_type": "direct_answer" | "faq" | "json_ld" | "entity_clarity" | "trust_signal",
      "placement": "<allowed placement>",
      "exact_example_text": "<copy-ready text OR FAQ block OR <=20-word instruction for json_ld>",
      "example_json_ld": "<string or null>"
    }
  ]
}

Else scoring_mode="heuristic":
{
  "url": "<page.url>",
  "page_type": "homepage" | "service" | "article" | "category" | "other",
  "diagnosis": {
    "page_score": <number 0-100>,
    "dominant_gap": "direct_answer_quality" | "entity_clarity" | "trust_signals" | "structured_data_quality",
    "ai_hesitation": "<max 25 words>"
  },
  "recommended_changes": [
    {
      "priority": "high" | "medium" | "low",
      "change_type": "direct_answer" | "faq" | "json_ld" | "entity_clarity" | "trust_signal",
      "placement": "<allowed placement>",
      "exact_example_text": "<copy-ready text OR FAQ block OR <=20-word instruction for json_ld>",
      "example_json_ld": "<string or null>"
    }
  ]
}

# ========================
EXAMPLE OUTPUT (MINIMAL ANCHOR)

This is an example of the TARGET FORMAT ONLY. Do not reuse its content; adapt to the page payload.

{
  "url": "https://example.com/service",
  "page_type": "service",
  "diagnosis": {
    "page_score": 54,
    "dominant_gap": "direct_answer_quality",
    "ai_hesitation": "No extractable definition near the top; AI cannot safely quote or summarize."
  },
  "recommended_changes": [
    {
      "priority": "high",
      "change_type": "direct_answer",
      "placement": "after <h1>",
      "exact_example_text": "A mandamus action is a federal lawsuit filed to compel an agency to decide on a delayed case. It does not guarantee approval, only action, and is typically used after normal inquiry steps fail and delays remain unexplained.",
      "example_json_ld": null
    },
    {
      "priority": "high",
      "change_type": "faq",
      "placement": "after section 'Process'",
      "exact_example_text": "Q: When is a delay considered unreasonable?\\nA: It depends on case type and posted processing times. Many consider mandamus only after standard inquiries and escalation steps do not produce movement.\\n\\nQ: Does it guarantee approval?\\nA: No. It seeks a decision, not a favorable outcome. The agency may still approve or deny based on the case merits.",
      "example_json_ld": null
    }
  ]
}

# ========================
NOW PRODUCE THE JSON

Use the provided page payload. Be conservative. MAX 5 changes. Ordered by impact.
Return ONLY the JSON object.
`;

function mapScoreToTier(score: number): string {
  if (score >= 90) return "Primary citation candidate";
  if (score >= 75) return "AI-reference capable";
  if (score >= 60) return "Functional AI presence";
  if (score >= 40) return "Weak / inconsistent";
  return "Invisible to AI";
}

export async function analyzeWithGLM(
  crawlData: CrawlData[],
): Promise<GeoScore> {
  try {
    // Collect all FAQs and JSON-LD from crawled pages upfront
    const allFaqs = crawlData.flatMap((p) => p.signals.directAnswerBlocks);
    const allJsonLd = crawlData.flatMap((p) => p.jsonLd);
    console.log(
      `Collected ${allFaqs.length} FAQ blocks and ${allJsonLd.length} JSON-LD blocks from crawl data.`,
    );
    console.log(crawlData);

    if (crawlData.length === 0) {
      return {
        overall_score: 0,
        tier: "Invisible to AI",
        section_scores: {
          entity_clarity: 0,
          direct_answers: 0,
          trust_signals: 0,
          competitive_positioning: 0,
          technical_accessibility: 0,
        },
        top_ai_hesitations: [],
        week1_fix_plan: ["No pages could be crawled"],
        limitations: ["No data available"],
        extracted_faqs: allFaqs,
        extracted_json_ld: allJsonLd,
      };
    }

    // Process each page and aggregate results
    const pageResults = await Promise.all(
      crawlData.slice(0, 5).map(async (page) => {
        const pagePayload = {
          site_context: {
            scoring_mode: "heuristic" as const,
          },
          page: {
            url: page.url,
            title: page.title || undefined,
            meta_description: page.metaDescription || undefined,
            h1: page.headings.h1[0] || undefined,
            headings: [
              ...page.headings.h1,
              ...page.headings.h2,
              ...page.headings.h3,
            ],
            main_text_excerpt: page.textContent.slice(0, 3000),
            json_ld_blocks:
              page.jsonLd.length > 0
                ? page.jsonLd.map((ld) => JSON.stringify(ld))
                : undefined,
            notes:
              page.textContent.length > 3000
                ? "Content truncated for analysis"
                : undefined,
          },
        };

        console.log("Sending page payload to GLM:", pagePayload);

        const response = await callGLM([
          {
            role: "system",
            content: GEO_AEO_PER_PAGE_REMEDIATION_PROMPT_V3_1,
          },
          {
            role: "user",
            content: JSON.stringify(pagePayload),
          },
        ]);

        console.log("Received GLM response for page:", response);

        return JSON.parse(response.choices[0].message.content || "{}");
      }),
    );

    // Aggregate scores across pages
    const avgScore = Math.round(
      pageResults.reduce((sum, r) => sum + (r.diagnosis?.page_score || 0), 0) /
        pageResults.length,
    );
    console.log(`Average page score across ${avgScore}`);

    // Count dominant gaps
    const gapCounts = pageResults.reduce(
      (acc, r) => {
        const gap = r.diagnosis?.dominant_gap;
        if (gap) acc[gap] = (acc[gap] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log("Dominant gap counts:", gapCounts);

    const topGap =
      (Object.entries(gapCounts) as Array<[string, number]>).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0] || "direct_answer_quality";

    // Build section scores based on gaps
    const sectionScores: GeoScore["section_scores"] = {
      entity_clarity: topGap === "entity_clarity" ? 40 : 70,
      direct_answers: topGap === "direct_answer_quality" ? 40 : 70,
      trust_signals: topGap === "trust_signals" ? 40 : 70,
      competitive_positioning: 60,
      technical_accessibility: topGap === "structured_data_quality" ? 40 : 70,
    };

    // Build top AI hesitations from page results
    const topAiHesitations = pageResults
      .filter((r) => r.diagnosis?.ai_hesitation)
      .slice(0, 3)
      .map((r) => ({
        issue: `${r.page_type || "Page"} analysis`,
        why_ai_hesitates: r.diagnosis?.ai_hesitation || "Unclear reasons",
        evidence: [r.url || "Unknown URL"],
        affected_urls: [r.url || ""],
      }));
    console.log("Top AI hesitations:", topAiHesitations);

    // Build week 1 fix plan from recommended changes
    const allChanges = pageResults.flatMap((r) => r.recommended_changes || []);
    const highPriorityChanges = allChanges
      .filter((c) => c.priority === "high")
      .slice(0, 5)
      .map(
        (c) =>
          `[${c.change_type}] ${c.placement}: ${c.exact_example_text?.slice(0, 80)}...`,
      );

    // Store raw page remediations for detailed report
    const pageRemediations: PageRemediation[] = pageResults.map((r) => ({
      url: r.url || "",
      page_type: r.page_type || "other",
      diagnosis: {
        page_score: r.diagnosis?.page_score,
        dominant_gap: r.diagnosis?.dominant_gap || "direct_answer_quality",
        ai_hesitation: r.diagnosis?.ai_hesitation || "",
      },
      recommended_changes: r.recommended_changes || [],
    }));

    console.log("Final aggregated GeoScore:", {
      overall_score: avgScore,
      tier: mapScoreToTier(avgScore),
      section_scores: sectionScores,
      top_ai_hesitations: topAiHesitations,
      week1_fix_plan:
        highPriorityChanges.length > 0
          ? highPriorityChanges
          : ["Review all pages for missing direct answers and structured data"],
      limitations: ["Analysis based on crawled content only"],
      extracted_faqs: allFaqs,
      extracted_json_ld: allJsonLd,
      page_remediations: pageRemediations,
    });

    return {
      overall_score: avgScore,
      tier: mapScoreToTier(avgScore),
      section_scores: sectionScores,
      top_ai_hesitations: topAiHesitations,
      week1_fix_plan:
        highPriorityChanges.length > 0
          ? highPriorityChanges
          : ["Review all pages for missing direct answers and structured data"],
      limitations: ["Analysis based on crawled content only"],
      extracted_faqs: allFaqs,
      extracted_json_ld: allJsonLd,
      page_remediations: pageRemediations,
      payment_status: "free", // Default to free, updated to paid after Stripe webhook
    };
  } catch (error) {
    console.error("GLM analysis failed:", error);
    throw new Error("Failed to analyze website with AI");
  }
}
