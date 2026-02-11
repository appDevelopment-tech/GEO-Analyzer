import { NextRequest, NextResponse } from "next/server";
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

    // Step 1: Create a "processing" row in Supabase immediately
    step = "supabase-insert";
    console.log(`[Analyze ${lap()}] Creating processing row...`);
    const dbResult: any = await supabase
      .from("Reports")
      .insert([
        {
          full_report: null,
          result: "processing",
          domain: normalizedUrl,
          email: email,
        },
      ])
      .select();

    const id = dbResult.data && dbResult.data[0]?.report_id;
    console.log(`[Analyze ${lap()}] Row created — report_id=${id}`);

    if (dbResult.error || !id) {
      console.error("Supabase insert error:", dbResult.error);
      return NextResponse.json(
        { error: "Failed to create report. Please try again.", _debug_step: step },
        { status: 500 },
      );
    }

    // Step 2: Return immediately — FE will trigger the worker
    console.log(`[Analyze ${lap()}] Returning report_id=${id} (processing)`);
    return NextResponse.json({
      report_id: id,
      success: true,
      status: "processing",
      url: normalizedUrl,
      _debug_step: "created",
      _debug_elapsed: lap(),
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
