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
  return NextResponse.json({
    ...data,
    full_report: report,
  });
}

export const runtime = 'nodejs';