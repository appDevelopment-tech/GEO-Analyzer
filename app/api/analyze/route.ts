import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/crawler";
import { analyzeWithOpenAI } from "@/lib/analyzer";
import { sendReport } from "@/lib/email";
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Step 1: Crawl the website
    const crawlData = await crawlWebsite(normalizedUrl);

    if (crawlData.length === 0) {
      return NextResponse.json(
        {
          error: "Unable to crawl website. Please check the URL and try again.",
        },
        { status: 400 },
      );
    }

    // Step 2: Analyze with OpenAI
    const geoScore = await analyzeWithOpenAI(crawlData);

    // Step 3: Send full report via email
    // const domain = new URL(normalizedUrl).hostname;
    // await sendReport(email, domain, geoScore);

    //Step 3 now is to save to supabase
    const dbResult = await supabase.from("Reports").insert([
      {
        email,
        full_report: JSON.stringify(geoScore),
        result: "pending",
        domain: normalizedUrl,
      },
    ]);
    // Optionally, update the result field after insert if you want to store 'success' or 'error'
    const status = dbResult.error ? "error" : "success";
    if (dbResult.data) {
      await supabase
        .from("Reports")
        .update({ result: status })
        .eq("email", email)
        .eq("domain", normalizedUrl);
    }

    // Step 4: Return partial report for immediate display
    return NextResponse.json({
      success: true,
      report: {
        overall_score: geoScore.overall_score,
        tier: geoScore.tier,
        section_scores: geoScore.section_scores,
        top_hesitation: geoScore.top_ai_hesitations[0] || null,
      },
      message: "Full report sent to your email",
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
