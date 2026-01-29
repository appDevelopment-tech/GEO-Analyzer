import fs from "node:fs/promises";
import path from "node:path";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { createClient } from "@supabase/supabase-js";

const reportId = process.argv[2];
const recipient = process.argv[3];

if (!reportId || !recipient) {
  console.error("Usage: node scripts/send-report.mjs <report_id> <email>");
  process.exit(1);
}

function applyEnv(contents) {
  const lines = contents.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!key) continue;
    if (!(key in process.env)) process.env[key] = value;
  }
}

function generateReportHTML(domain, score) {
  const hesitationsHTML = (score.top_ai_hesitations || [])
    .map(
      (h, i) => `
      <div style="margin-bottom: 24px; padding: 16px; background: #f5f5f7; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 16px; font-weight: 600;">
          ${i + 1}. ${h.issue}
        </h3>
        <p style="margin: 0 0 12px 0; color: #6e6e73; font-size: 14px;">
          ${h.why_ai_hesitates}
        </p>
        <div style="margin-top: 8px;">
          <strong style="font-size: 13px; color: #86868b;">Evidence:</strong>
          <ul style="margin: 4px 0 0 20px; padding: 0; color: #6e6e73; font-size: 13px;">
            ${(h.evidence || []).map((e) => `<li>${e}</li>`).join("")}
          </ul>
        </div>
      </div>
    `,
    )
    .join("");

  const fixPlanHTML = (score.week1_fix_plan || [])
    .map((fix, i) => `<li style="margin-bottom: 8px;">${i + 1}. ${fix}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif; background: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 32px; font-weight: 700;">GEO Analyzer</h1>
      <p style="margin: 0; color: #6e6e73; font-size: 16px;">AI Recommendation Readiness Report. If you have questions about the findings, just reply to this email.</p>
    </div>

    <div style="background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
      <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.8); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Overall Score</p>
      <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 64px; font-weight: 700;">${score.overall_score}</h2>
      <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">${score.tier}</p>
    </div>

    <p style="text-align: center; color: #86868b; font-size: 14px; margin-bottom: 32px;">Analysis for: <strong>${domain}</strong></p>

    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">Detailed Scores</h2>
      ${Object.entries(score.section_scores || {})
        .map(
          ([key, value]) => `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #1d1d1f; font-size: 15px; font-weight: 500; text-transform: capitalize;">${key.replace(/_/g, " ")}</span>
            <span style="color: #0071e3; font-size: 15px; font-weight: 600;">${value}</span>
          </div>
          <div style="background: #e8e8ed; border-radius: 4px; height: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #0071e3 0%, #00c6ff 100%); height: 100%; width: ${value}%; border-radius: 4px;"></div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">Top AI Hesitations</h2>
      ${hesitationsHTML}
    </div>

    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">What to Fix First (Week 1)</h2>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">${fixPlanHTML}</ul>
    </div>

    <div style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
      <p style="margin: 0 0 8px 0; color: #86868b; font-size: 13px;">This is a diagnostic report, not an exhaustive audit. For more information, please contact <a href="mailto:max.petrusenko@gmail.com">me</a> directly.</p>
      <p style="margin: 0; color: #86868b; font-size: 13px;">© ${new Date().getFullYear()} GEO Analyzer. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

async function main() {
  const envPath = path.resolve(process.cwd(), ".env");
  const envContents = await fs.readFile(envPath, "utf8");
  applyEnv(envContents);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  const mailgunKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;

  if (!supabaseUrl || !supabaseKey || !mailgunKey || !mailgunDomain) {
    throw new Error("Missing required environment variables for Supabase or Mailgun.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("Reports")
    .select("id, domain, full_report")
    .eq("report_id", reportId)
    .single();

  if (error || !data) {
    throw new Error(`Report not found for report_id ${reportId}`);
  }

  const fullReport =
    typeof data.full_report === "string"
      ? JSON.parse(data.full_report)
      : data.full_report;

  const score = {
    overall_score: fullReport.score || 0,
    tier: fullReport.tier || "Invisible to AI",
    section_scores: fullReport.section_scores || {
      entity_clarity: 0,
      direct_answers: 0,
      trust_signals: 0,
      competitive_positioning: 0,
      technical_accessibility: 0,
    },
    top_ai_hesitations: fullReport.top_hesitations || [],
    week1_fix_plan: fullReport.week1_fix_plan || [],
    limitations: fullReport.limitations || [],
    extracted_faqs: fullReport.extracted_faqs || [],
    extracted_json_ld: fullReport.extracted_json_ld || [],
  };

  const htmlContent = generateReportHTML(data.domain, score);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: mailgunKey });

  let emailResult = true;
  try {
    await mg.messages.create(mailgunDomain, {
      from: `GEO Analyzer <noreply@${mailgunDomain}>`,
      to: [recipient],
      subject: `Your AI Recommendation Readiness Report for ${data.domain}`,
      html: htmlContent,
    });
  } catch (err) {
    emailResult = err instanceof Error ? err.message : String(err);
  }

  await supabase
    .from("Reports")
    .update({ email_result: emailResult })
    .eq("id", data.id);

  if (emailResult !== true) {
    throw new Error(`Failed to send report email: ${emailResult}`);
  }

  console.log(`Report sent to ${recipient}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
