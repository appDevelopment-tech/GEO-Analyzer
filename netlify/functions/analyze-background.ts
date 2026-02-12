import { createClient } from "@supabase/supabase-js";
import { crawlWebsite } from "../../lib/crawler";
import { analyzeWithOpenAI } from "../../lib/analyzer-v1";

/**
 * Netlify Background Function — runs for up to 15 minutes.
 * Netlify returns 202 Accepted immediately; the function keeps running.
 * The FE polls Supabase for results.
 */
export default async function handler(req: Request) {
  const t0 = Date.now();
  const lap = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
  let step = "init";
  let reportId: string | undefined;

  try {
    const body = await req.json();
    const { report_id, url } = body;
    reportId = report_id;

    if (!report_id || !url) {
      console.error("[BG Worker] Missing report_id or url");
      return;
    }

    console.log(`[BG Worker ${lap()}] Start — report_id=${report_id}, url=${url}`);

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
      console.warn(`[BG Worker ${lap()}] Report ${report_id} not found`);
      return;
    }

    if (existing.result !== "processing") {
      console.log(`[BG Worker ${lap()}] Report ${report_id} already ${existing.result} — skipping`);
      return;
    }

    // Step 1: Crawl
    step = "crawl";
    console.log(`[BG Worker ${lap()}] Crawling ${url}...`);
    const crawlData = await crawlWebsite(url);
    console.log(`[BG Worker ${lap()}] Crawl done — ${crawlData.length} page(s), textLen=${crawlData[0]?.textContent?.length ?? 0}`);

    if (crawlData.length === 0 || !crawlData[0]?.textContent) {
      console.error(`[BG Worker ${lap()}] Crawl returned no usable data`);
      await writeResult(supabase, report_id, existing, "error",
        JSON.stringify({ error: "Unable to crawl website. The site may be blocking requests." }));
      return;
    }

    // Step 2: OpenAI analysis (no timeout needed — we have 15 minutes)
    step = "openai";
    console.log(`[BG Worker ${lap()}] Sending to OpenAI...`);
    const geoScore = await analyzeWithOpenAI(crawlData);
    console.log(`[BG Worker ${lap()}] OpenAI done — score=${geoScore.overall_score}, tier=${geoScore.tier}`);

    // Step 3: Write results to Supabase
    step = "supabase-write";
    console.log(`[BG Worker ${lap()}] Writing results to Supabase...`);
    const writeOk = await writeResult(supabase, report_id, existing, "success",
      JSON.stringify(geoScore));

    if (!writeOk) {
      console.error(`[BG Worker ${lap()}] Failed to write results to Supabase`);
      return;
    }

    console.log(`[BG Worker ${lap()}] Done — report_id=${report_id} written successfully`);
  } catch (error: any) {
    const elapsed = lap();
    console.error(`[BG Worker ${elapsed}] FAILED at step="${step}":`, error?.message || error);

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
        console.error(`[BG Worker] Failed to mark report as errored:`, dbErr.message);
      }
    }
  }
}

async function writeResult(
  supabase: any,
  reportId: string,
  existing: { domain?: string; email?: string },
  result: string,
  fullReport: string,
): Promise<boolean> {
  const { data: updated } = await supabase
    .from("Reports")
    .update({ full_report: fullReport, result })
    .eq("report_id", reportId)
    .select("report_id");

  if (updated && updated.length > 0) {
    console.log(`[BG Worker] UPDATE succeeded for ${reportId}`);
    return true;
  }

  console.warn(`[BG Worker] UPDATE returned 0 rows — falling back to DELETE + INSERT`);

  const { error: deleteErr } = await supabase
    .from("Reports")
    .delete()
    .eq("report_id", reportId);

  if (deleteErr) {
    console.error(`[BG Worker] DELETE failed:`, deleteErr.message);
  }

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
    console.error(`[BG Worker] INSERT failed:`, insertErr.message);

    const { data: retry } = await supabase
      .from("Reports")
      .update({ full_report: fullReport, result })
      .eq("report_id", reportId)
      .select("report_id");

    if (retry && retry.length > 0) {
      console.log(`[BG Worker] Retry UPDATE succeeded for ${reportId}`);
      return true;
    }

    console.error(`[BG Worker] All write attempts failed for ${reportId}`);
    return false;
  }

  console.log(`[BG Worker] INSERT succeeded for ${reportId}`, inserted);
  return true;
}

export const config = {
  type: "background" as const,
};
