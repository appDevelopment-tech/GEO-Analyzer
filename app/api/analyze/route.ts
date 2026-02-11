import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/crawler";
import { analyzeWithOpenAI } from "@/lib/analyzer-v1";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  const lap = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
  let step = "init";

  try {
    step = "supabase-init";
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );
    const body = await request.json();
    const { url, email } = body;
    console.log(`[Analyze ${lap()}] Start — url=${url}`);

    if (!url || !email) {
      return NextResponse.json(
        { error: "URL and email are required", _debug_step: step },
        { status: 400 },
      );
    }

    // --- RATE LIMITING: 3 requests per email per hour ---
    step = "rate-limit";
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("Reports")
      .select("id", { count: "exact", head: true })
      .eq("domain", url)
      .eq("email", email)
      .gte("created_at", oneHourAgo);
    console.log(`[Analyze ${lap()}] Rate-limit check done — count=${count}`);
    if (countError) {
      console.error("Rate limit count error:", countError);
      return NextResponse.json(
        { error: "Rate limit check failed. Please try again later.", _debug_step: step },
        { status: 500 },
      );
    }
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Only 3 analyses allowed per hour.", _debug_step: step },
        { status: 429 },
      );
    }
    // --- END RATE LIMITING ---

    // Validate URL
    let normalizedUrl = url;
    if (!url.startsWith("http")) {
      normalizedUrl = `https://${url}`;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format", _debug_step: "validate-url" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", _debug_step: "validate-email" },
        { status: 400 },
      );
    }

    // Step 1: Fetch the website
    step = "crawl";
    console.log(`[Analyze ${lap()}] Crawling ${normalizedUrl}...`);
    const crawlData = await crawlWebsite(normalizedUrl);
    console.log(`[Analyze ${lap()}] Crawl done — ${crawlData.length} page(s), textLen=${crawlData[0]?.textContent?.length ?? 0}`);

    if (crawlData.length === 0) {
      return NextResponse.json(
        { error: "Unable to crawl website. Please check the URL and try again.", _debug_step: step },
        { status: 400 },
      );
    }

    // Step 2: Analyze with AI
    step = "openai";
    console.log(`[Analyze ${lap()}] Sending to OpenAI...`);
    const geoScore = await analyzeWithOpenAI(crawlData);
    console.log(`[Analyze ${lap()}] OpenAI done — score=${geoScore.overall_score}, tier=${geoScore.tier}`);

    // Step 3: Save to Supabase
    step = "supabase-insert";
    console.log(`[Analyze ${lap()}] Inserting into Supabase...`);
    const dbResult: any = await supabase
      .from("Reports")
      .insert([
        {
          full_report: JSON.stringify(geoScore),
          result: "success",
          domain: normalizedUrl,
          email: email,
        },
      ])
      .select();

    const id = dbResult.data && dbResult.data[0]?.report_id;
    console.log(`[Analyze ${lap()}] Supabase done — report_id=${id}, error=${dbResult.error?.message ?? "none"}`);

    if (dbResult.error) {
      console.error("Supabase insert error:", dbResult.error);
    }

    // Step 4: Return partial report for immediate display
    step = "response";
    const firstPageRemediation = (geoScore.page_remediations || [])[0];

    return NextResponse.json({
      report_id: id,
      success: true,
      payment_status: "free",
      total_pages: (geoScore.page_remediations || []).length,
      _debug_step: step,
      _debug_elapsed: lap(),
      report: {
        overall_score: geoScore.overall_score,
        tier: geoScore.tier,
        section_scores: geoScore.section_scores,
        top_hesitation: geoScore.top_ai_hesitations[0] || null,
        page_remediations: firstPageRemediation ? [firstPageRemediation] : [],
      },
    });
  } catch (error: any) {
    const elapsed = lap();
    console.error(`[Analyze ${elapsed}] FAILED at step="${step}":`, error?.message || error);
    return NextResponse.json(
      {
        error: error.message || "Analysis failed. Please try again.",
        _debug_step: step,
        _debug_elapsed: elapsed,
      },
      { status: 500 },
    );
  }
}
