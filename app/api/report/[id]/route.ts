import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

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
    if (report.ai_query_simulations && report.ai_query_simulations.length > 1) {
      report.ai_query_simulations = report.ai_query_simulations.map(
        (sim: any, i: number) =>
          i === 0
            ? sim
            : {
                ...sim,
                snippet: "Unlock full report to see this result",
                competitors_mentioned: [],
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

    // Redact generated JSON-LD: keep first block, placeholder rest
    if (report.generated_json_ld && report.generated_json_ld.length > 1) {
      report.generated_json_ld = report.generated_json_ld.map(
        (block: any, i: number) =>
          i === 0
            ? block
            : {
                ...block,
                code: '{ "Unlock full report to see this schema" }',
              },
      );
    }
  }

  return NextResponse.json({
    ...data,
    full_report: report,
    is_locked: !isPaid,
  });
}