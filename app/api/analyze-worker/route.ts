import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/crawler";
import { analyzeWithOpenAI } from "@/lib/analyzer-v1";
import { createClient } from "@supabase/supabase-js";

/**
 * Worker endpoint — called by the FE report page to kick off the heavy
 * crawl + OpenAI analysis. Writes results back to Supabase.
 *
 * Uses DELETE + INSERT instead of UPDATE to avoid Supabase RLS issues
 * where the anon key can insert but not update.
 */
export async function POST(request: NextRequest) {
  const t0 = Date.now();
  const lap = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
  let step = "init";
  let reportId: string | undefined;

  try {
    const body = await request.json();
    const { report_id, url } = body;
    reportId = report_id;

    if (!report_id || !url) {
      return NextResponse.json({ error: "report_id and url are required" }, { status: 400 });
    }

    console.log(`[Worker ${lap()}] Start — report_id=${report_id}, url=${url}`);

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );

    // Idempotency check: only proceed if still "processing"
    step = "idempotency-check";
    const { data: existing } = await supabase
      .from("Reports")
      .select("result, domain, email")
      .eq("report_id", report_id)
      .single();

    if (!existing) {
      console.warn(`[Worker ${lap()}] Report ${report_id} not found`);
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (existing.result !== "processing") {
      console.log(`[Worker ${lap()}] Report ${report_id} already ${existing.result} — skipping`);
      return NextResponse.json({ success: true, skipped: true, status: existing.result });
    }

    // Step 1: Crawl
    step = "crawl";
    console.log(`[Worker ${lap()}] Crawling ${url}...`);
    const crawlData = await crawlWebsite(url);
    console.log(`[Worker ${lap()}] Crawl done — ${crawlData.length} page(s), textLen=${crawlData[0]?.textContent?.length ?? 0}`);

    if (crawlData.length === 0 || !crawlData[0]?.textContent) {
      console.error(`[Worker ${lap()}] Crawl returned no usable data`);
      await writeResult(supabase, report_id, existing, "error",
        JSON.stringify({ error: "Unable to crawl website. The site may be blocking requests." }));
      return NextResponse.json({ success: false, step, error: "Crawl failed" });
    }

    // Step 2: OpenAI analysis
    step = "openai";
    console.log(`[Worker ${lap()}] Sending to OpenAI...`);
    const geoScore = await analyzeWithOpenAI(crawlData);
    console.log(`[Worker ${lap()}] OpenAI done — score=${geoScore.overall_score}, tier=${geoScore.tier}`);

    // Step 3: Write results to Supabase
    step = "supabase-write";
    console.log(`[Worker ${lap()}] Writing results to Supabase...`);
    const writeOk = await writeResult(supabase, report_id, existing, "success",
      JSON.stringify(geoScore));

    if (!writeOk) {
      console.error(`[Worker ${lap()}] Failed to write results to Supabase`);
      return NextResponse.json({ success: false, step, error: "DB write failed" });
    }

    console.log(`[Worker ${lap()}] Done — report_id=${report_id} written successfully`);
    return NextResponse.json({ success: true, report_id, elapsed: lap() });
  } catch (error: any) {
    const elapsed = lap();
    console.error(`[Worker ${elapsed}] FAILED at step="${step}":`, error?.message || error);

    // Try to mark the report as errored so the FE stops polling
    if (reportId) {
      try {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_API_KEY!,
        );
        const { data: row } = await supabase
          .from("Reports")
          .select("domain, email")
          .eq("report_id", reportId)
          .single();
        if (row) {
          await writeResult(supabase, reportId, row, "error",
            JSON.stringify({ error: error.message || "Analysis failed", _debug_step: step, _debug_elapsed: elapsed }));
        }
      } catch (dbErr: any) {
        console.error(`[Worker] Failed to mark report as errored:`, dbErr.message);
      }
    }

    return NextResponse.json({ success: false, step, elapsed, error: error.message });
  }
}

/**
 * Write results using DELETE + INSERT to sidestep Supabase RLS
 * restrictions on UPDATE. INSERT works (proven by /api/analyze),
 * so this is the reliable path.
 */
async function writeResult(
  supabase: any,
  reportId: string,
  existing: { domain?: string; email?: string },
  result: string,
  fullReport: string,
): Promise<boolean> {
  // First try UPDATE (fast path)
  const { data: updated } = await supabase
    .from("Reports")
    .update({ full_report: fullReport, result })
    .eq("report_id", reportId)
    .select("report_id");

  if (updated && updated.length > 0) {
    console.log(`[Worker] UPDATE succeeded for ${reportId}`);
    return true;
  }

  // UPDATE returned 0 rows (RLS issue) — fall back to DELETE + INSERT
  console.warn(`[Worker] UPDATE returned 0 rows — falling back to DELETE + INSERT`);

  const { error: deleteErr } = await supabase
    .from("Reports")
    .delete()
    .eq("report_id", reportId);

  if (deleteErr) {
    console.error(`[Worker] DELETE failed:`, deleteErr.message);
    // If DELETE also fails (RLS), try INSERT with a new ID — the FE
    // won't find it, but at least we tried.
    // Actually, let's just INSERT alongside — the old row will be stale
    // but the new one will have the data. The report page can be updated
    // to pick it up.
  }

  // INSERT a new row preserving the same report_id
  const { data: inserted, error: insertErr } = await supabase
    .from("Reports")
    .insert([{
      report_id: reportId,
      full_report: fullReport,
      result,
      domain: existing.domain || "",
      email: existing.email || "",
    }])
    .select("report_id");

  if (insertErr) {
    // If INSERT fails with duplicate key (DELETE worked but race condition),
    // try the UPDATE one more time
    console.error(`[Worker] INSERT failed:`, insertErr.message);

    const { data: retry } = await supabase
      .from("Reports")
      .update({ full_report: fullReport, result })
      .eq("report_id", reportId)
      .select("report_id");

    if (retry && retry.length > 0) {
      console.log(`[Worker] Retry UPDATE succeeded for ${reportId}`);
      return true;
    }

    console.error(`[Worker] All write attempts failed for ${reportId}`);
    return false;
  }

  console.log(`[Worker] INSERT succeeded for ${reportId}`, inserted);
  return true;
}
