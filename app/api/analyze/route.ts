import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/crawler";
import { analyzeWithOpenAI } from "@/lib/analyzer-v1";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );
    const body = await request.json();
    const { url, email } = body;

    if (!url || !email) {
      return NextResponse.json(
        { error: "URL and email are required" },
        { status: 400 },
      );
    }

    // --- RATE LIMITING: 3 requests per email per hour ---
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    // Count reports for this email in the last hour
    const { count, error: countError } = await supabase
      .from("Reports")
      .select("id", { count: "exact", head: true })
      .eq("domain", url)
      .eq("email", email)
      .gte("created_at", oneHourAgo);
    if (countError) {
      console.error("Rate limit count error:", countError);
      return NextResponse.json(
        { error: "Rate limit check failed. Please try again later." },
        { status: 500 },
      );
    }
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Rate limit exceeded: Only 3 analyses allowed per hour." },
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
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Step 1: Fetch the website (always returns at least one item, never throws)
    const crawlData = await crawlWebsite(normalizedUrl);

    // Step 2: Analyze with AI
    const geoScore = await analyzeWithOpenAI(crawlData);

    //Step 3 now is to save to supabase
    const dbResult: any = await supabase
      .from("Reports")
      .insert([
        {
          full_report: JSON.stringify(geoScore),
          result: "pending",
          domain: normalizedUrl,
          email: email,
        },
      ])
      .select();
    const id = dbResult.data && dbResult.data[0]?.report_id;
    // Optionally, update the result field after insert if you want to store 'success' or 'error'
    const status = dbResult.error ? "error" : "success";
    if (dbResult.data) {
      await supabase
        .from("Reports")
        .update({ result: status })
        .eq("report_id", id);
    }

    // Step 4: Return partial report for immediate display
    const firstPageRemediation = (geoScore.page_remediations || [])[0];

    return NextResponse.json({
      report_id: id,
      success: true,
      payment_status: "free",
      total_pages: (geoScore.page_remediations || []).length,
      report: {
        overall_score: geoScore.overall_score,
        tier: geoScore.tier,
        section_scores: geoScore.section_scores,
        top_hesitation: geoScore.top_ai_hesitations[0] || null,
        // First page remediation (free preview)
        page_remediations: firstPageRemediation ? [firstPageRemediation] : [],
      },
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
