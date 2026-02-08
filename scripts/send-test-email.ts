import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { sendReport } from "../lib/email";

async function main() {
  const reportId = process.argv[2];
  const toEmail = process.argv[3];

  if (!reportId || !toEmail) {
    console.error("Usage: tsx scripts/send-test-email.ts <report_id> <email>");
    process.exit(1);
  }

  console.log(`Fetching report ${reportId}...`);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
  );

  const { data, error } = await supabase
    .from("Reports")
    .select("*")
    .eq("report_id", reportId)
    .single();

  if (error || !data) {
    console.error("Report not found:", error);
    process.exit(1);
  }

  console.log(`Found report for domain: ${data.domain}`);
  console.log(`Payment status: ${data.payment_status}`);

  let score = data.full_report;
  if (typeof score === "string") {
    score = JSON.parse(score);
  }

  // Force paid status so we get the full report
  score.payment_status = "paid";

  const domain = data.domain
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  console.log(`Sending full report email to ${toEmail}...`);

  await sendReport(toEmail, domain, score, reportId);

  console.log("Email sent successfully!");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
