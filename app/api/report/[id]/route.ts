import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Prevent Next.js / Netlify from caching this route — every poll must hit Supabase fresh
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
  );
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing report id" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("Reports")
    .select("*")
    .eq("report_id", id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // No-cache headers for every response from this route
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Netlify-CDN-Cache-Control": "no-store",
  };

  // Still processing — tell the FE to keep polling
  if (data.result === "processing") {
    return NextResponse.json({
      report_id: id,
      status: "processing",
      domain: data.domain,
    }, { headers: noCacheHeaders });
  }

  // Worker failed — return the error
  if (data.result === "error") {
    let errorDetail = "Analysis failed. Please try again.";
    if (data.full_report) {
      try {
        const parsed = typeof data.full_report === "string"
          ? JSON.parse(data.full_report)
          : data.full_report;
        errorDetail = parsed.error || errorDetail;
      } catch {
        // keep default
      }
    }
    return NextResponse.json({
      report_id: id,
      status: "error",
      error: errorDetail,
    }, { headers: noCacheHeaders });
  }

  // Parse full_report if it's a string
  let report = data.full_report;
  if (typeof report === "string") {
    try {
      report = JSON.parse(report);
    } catch {
      // fallback to raw string
    }
  }

  const isPaid = data.payment_status === "paid";

  // Server-side redaction for free users
  if (!isPaid && typeof report === "object" && report !== null) {
    // Redact AI query simulations: keep first, placeholder rest
    // Keep competitors_mentioned visible (motivating, not sensitive)
    if (report.ai_query_simulations && report.ai_query_simulations.length > 1) {
      report.ai_query_simulations = report.ai_query_simulations.map(
        (sim: any, i: number) =>
          i === 0
            ? sim
            : {
                ...sim,
                snippet: "Unlock full report to see this result",
              },
      );
    }

    // Redact hesitations: keep first fully, placeholder rest
    if (report.top_ai_hesitations && report.top_ai_hesitations.length > 1) {
      report.top_ai_hesitations = report.top_ai_hesitations.map(
        (h: any, i: number) =>
          i === 0
            ? h
            : {
                ...h,
                why_ai_hesitates: "Unlock full report to see details",
                evidence: ["Details available in full report"],
              },
      );
    }

    // Redact fix plan: keep first, placeholder rest
    if (report.week1_fix_plan && report.week1_fix_plan.length > 1) {
      report.week1_fix_plan = report.week1_fix_plan.map(
        (item: string, i: number) =>
          i === 0 ? item : "Unlock full report for this fix",
      );
    }

    // Redact real competitor details: keep names, hide scores + strengths
    if (report.real_competitors && report.real_competitors.length > 0) {
      report.real_competitors = report.real_competitors.map((c: any) => ({
        name: c.name,
        url: c.url,
        ai_readiness_estimate: undefined,
        strengths: [],
      }));
    }

    // Redact copy blocks entirely for free users
    if (report.copy_blocks) {
      report.copy_blocks = undefined;
    }
  }

  return NextResponse.json({
    ...data,
    status: "success",
    full_report: report,
    is_locked: !isPaid,
  }, { headers: noCacheHeaders });
}
