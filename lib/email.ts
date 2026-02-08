import formData from "form-data";
import Mailgun from "mailgun.js";
import { GeoScore, PageRemediation, AIQuerySimulation, GeneratedJsonLd } from "@/types/geo";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

import { createClient } from "@supabase/supabase-js";

export async function sendReport(
  email: string,
  domain: string,
  score: GeoScore,
  reportId: string,
): Promise<void> {
  const isPaid = score.payment_status === "paid";

  // Generate short email body
  const shortEmailBody = generateShortEmailBody(domain, score, isPaid);

  // Generate detailed HTML attachment — full professional report for paid, basic for free
  const detailedHTML = generateDetailedReportHTML(domain, score, isPaid);

  // Create temp file for attachment
  const filename = `geo-report-${domain.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.html`;
  const tempFilePath = join(tmpdir(), filename);

  try {
    await writeFile(tempFilePath, detailedHTML, "utf-8");

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );

    let emailResult: string | boolean = true;
    try {
      const messageData: any = {
        from: `GEO Analyzer <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: isPaid
          ? `Your Full GEO Report for ${domain} (Score: ${score.overall_score}/100)`
          : `Your GEO Report for ${domain} (Score: ${score.overall_score}/100)`,
        html: shortEmailBody,
        attachment: [
          {
            filename: filename,
            data: tempFilePath,
          },
        ],
      };

      await mg.messages.create(process.env.MAILGUN_DOMAIN || "", messageData);
      emailResult = true;
    } catch (error) {
      console.error("Failed to send email:", error);
      emailResult = error instanceof Error ? error.message : String(error);
    }

    // Clean up temp file
    try {
      await unlink(tempFilePath);
    } catch {}

    // Update Supabase Reports.email_result
    if (reportId) {
      await supabase
        .from("Reports")
        .update({ email_result: emailResult })
        .eq("id", reportId);
    }

    if (emailResult !== true) {
      throw new Error("Failed to send report email");
    }
  } catch (error) {
    // Clean up temp file on error
    try {
      await unlink(tempFilePath);
    } catch {}
    throw error;
  }
}

function generateShortEmailBody(
  domain: string,
  score: GeoScore,
  isPaid: boolean,
): string {
  const totalPages = score.page_remediations?.length || 0;
  const citationScore = score.ai_citation_score || 0;
  const queryCount = score.ai_query_simulations?.length || 0;
  const mentionedCount = (score.ai_query_simulations || []).filter((s) => s.mentioned).length;
  const jsonLdCount = score.generated_json_ld?.length || 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif; background: #f5f5f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 32px; font-weight: 700;">
        GEO/AEO Analyzer
      </h1>
      <p style="margin: 0; color: #6e6e73; font-size: 15px;">
        ${isPaid ? "Your Full AI Readiness Report is ready" : "Your AI Recommendation Readiness Report is ready"}
      </p>
    </div>

    <!-- Score Summary -->
    <div style="background: white; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <p style="margin: 0 0 16px 0; color: #86868b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
        Overall Score
      </p>
      <h2 style="margin: 0 0 8px 0; color: #0071e3; font-size: 56px; font-weight: 700;">
        ${score.overall_score}
      </h2>
      <p style="margin: 0; color: #6e6e73; font-size: 16px; font-weight: 500;">
        ${score.tier}
      </p>
      <p style="margin: 16px 0 0 0; color: #86868b; font-size: 14px;">
        Analysis for: <strong>${domain}</strong>
      </p>
      ${citationScore > 0 ? `
      <div style="margin-top: 16px; padding: 12px 0; border-top: 1px solid #f0f0f5;">
        <p style="margin: 0 0 4px 0; color: #86868b; font-size: 12px; text-transform: uppercase;">AI Citation Probability</p>
        <p style="margin: 0; color: ${citationScore >= 60 ? "#10b981" : citationScore >= 35 ? "#f59e0b" : "#ef4444"}; font-size: 28px; font-weight: 700;">${citationScore}%</p>
      </div>
      ` : ""}
    </div>

    <!-- Attachment Notice -->
    <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <h3 style="margin: 0 0 12px 0; color: #1d1d1f; font-size: 18px; font-weight: 600;">
        ${isPaid ? "📎 Your Full Report is Attached" : "📎 Detailed Report Attached"}
      </h3>
      <p style="margin: 0 0 12px 0; color: #6e6e73; font-size: 15px; line-height: 1.6;">
        ${isPaid
          ? "Your complete GEO/AEO report is attached as an HTML file. Open it in any browser to see everything:"
          : "Your report summary is attached as an HTML file. Open it in any browser to see:"
        }
      </p>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #6e6e73; font-size: 14px; line-height: 1.8;">
        ${isPaid ? `
        <li>AI Citation Probability score (${citationScore}%)</li>
        <li>${queryCount} AI query simulations — ${mentionedCount} mention your site</li>
        <li>All ${score.top_ai_hesitations?.length || 0} AI hesitations with evidence</li>
        <li>Week 1 fix roadmap (${score.week1_fix_plan?.length || 0} action items)</li>
        <li>${jsonLdCount} ready-to-paste JSON-LD schema blocks</li>
        <li>Per-page analysis for all ${totalPages} pages with exact copy</li>
        ` : `
        <li>Per-page analysis with scores</li>
        <li>Exact copy you can add to each page</li>
        <li>JSON-LD schema examples ready to implement</li>
        <li>Placement instructions for each change</li>
        `}
      </ul>
      ${!isPaid && totalPages > 1 ? `
      <div style="margin-top: 20px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
          Free Report Preview
        </p>
        <p style="margin: 0; color: #78350f; font-size: 13px;">
          This free report shows remediation for 1 of ${totalPages} pages analyzed. Upgrade to get the full report with all data.
        </p>
      </div>
      ` : ""}
    </div>

    <!-- Quick Summary -->
    <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <h3 style="margin: 0 0 16px 0; color: #1d1d1f; font-size: 18px; font-weight: 600;">
        Quick Summary
      </h3>

      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; color: #86868b; font-size: 12px; text-transform: uppercase;">
          Top Issue to Fix
        </p>
        <p style="margin: 0; color: #1d1d1f; font-size: 15px;">
          ${score.top_ai_hesitations[0]?.why_ai_hesitates || "No major issues identified"}
        </p>
      </div>

      <div>
        <p style="margin: 0 0 8px 0; color: #86868b; font-size: 12px; text-transform: uppercase;">
          Pages Analyzed
        </p>
        <p style="margin: 0; color: #1d1d1f; font-size: 15px;">
          ${totalPages} page${totalPages !== 1 ? "s" : ""} analyzed${isPaid ? " — all included in attached report" : ""}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #d2d2d7;">
      <p style="margin: 0 0 8px 0; color: #86868b; font-size: 13px;">
        Questions? Just reply to this email.
      </p>
      <p style="margin: 0; color: #86868b; font-size: 13px;">
        &copy; ${new Date().getFullYear()} GEO/AEO Analyzer. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

function getScoreColor(s: number): string {
  if (s >= 75) return "#10b981";
  if (s >= 60) return "#3b82f6";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
}

function getCitationColor(s: number): { bg: string; text: string; label: string } {
  if (s >= 60) return { bg: "#10b981", text: "#065f46", label: "Strong" };
  if (s >= 35) return { bg: "#f59e0b", text: "#92400e", label: "Moderate" };
  return { bg: "#ef4444", text: "#991b1b", label: "Weak" };
}

function generateDetailedReportHTML(
  domain: string,
  score: GeoScore,
  isPaid: boolean,
): string {
  const pages = score.page_remediations || [];
  const pagesToShow = isPaid ? pages : pages.slice(0, 1);
  const totalPages = pages.length;
  const citationScore = score.ai_citation_score || 0;
  const citationColor = getCitationColor(citationScore);
  const scoreColor = getScoreColor(score.overall_score);

  // Generate per-page remediation HTML
  const pagesHTML = pagesToShow
    .map((page, pageIndex) => generatePageRemediationHTML(page, pageIndex + 1))
    .join("");

  // --- AI Query Simulations (paid only) ---
  const querySimsHTML = isPaid && score.ai_query_simulations && score.ai_query_simulations.length > 0
    ? score.ai_query_simulations.map((sim) => `
      <div style="margin-bottom: 12px; padding: 14px 18px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
        <div style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 6px;">&ldquo;${escapeHtml(sim.query)}&rdquo;</div>
        <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;
          background: ${sim.mentioned ? "#dcfce7" : "#fee2e2"}; color: ${sim.mentioned ? "#166534" : "#991b1b"};">
          ${sim.mentioned ? "Mentioned" : "Not Found"}${sim.position ? ` &mdash; ${sim.position}${sim.position === 1 ? "st" : sim.position === 2 ? "nd" : sim.position === 3 ? "rd" : "th"}` : ""}
        </span>
        <p style="font-size: 13px; color: #6b7280; margin: 8px 0 0; font-style: italic; line-height: 1.5;">${escapeHtml(sim.snippet)}</p>
        ${sim.competitors_mentioned && sim.competitors_mentioned.length > 0 ? `
        <div style="margin-top: 8px;">
          <span style="font-size: 11px; color: #9ca3af;">Also mentioned: </span>
          ${sim.competitors_mentioned.map((c) => `<span style="display: inline-block; padding: 1px 8px; margin: 2px 4px 2px 0; background: #f3f4f6; border-radius: 8px; font-size: 11px; color: #6b7280;">${escapeHtml(c)}</span>`).join("")}
        </div>` : ""}
      </div>`).join("")
    : "";

  // --- AI Hesitations (paid: all, free: first only) ---
  const hesitationsToShow = isPaid ? (score.top_ai_hesitations || []) : (score.top_ai_hesitations || []).slice(0, 1);
  const hesitationsHTML = hesitationsToShow.map((h) => `
    <div style="margin-bottom: 16px; padding: 18px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 10px 10px 0;">
      <strong style="color: #1f2937; font-size: 15px;">${escapeHtml(h.issue)}</strong>
      <p style="color: #4b5563; margin: 8px 0 0; font-size: 14px; line-height: 1.6;">${escapeHtml(h.why_ai_hesitates)}</p>
      ${h.evidence && h.evidence.length > 0 ? `
      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #fcd34d;">
        <p style="font-size: 12px; font-weight: 600; color: #92400e; margin: 0 0 6px;">Evidence:</p>
        ${h.evidence.map((e) => `<div style="font-size: 13px; color: #78350f; margin-bottom: 4px; padding-left: 12px;">&bull; ${escapeHtml(e)}</div>`).join("")}
      </div>` : ""}
    </div>`).join("");

  // --- Fix Roadmap (paid: all, free: first only) ---
  const fixPlanToShow = isPaid ? (score.week1_fix_plan || []) : (score.week1_fix_plan || []).slice(0, 1);
  const fixPlanHTML = fixPlanToShow.map((item, i) => `
    <div style="margin-bottom: 10px; padding: 12px 16px; background: ${i === 0 ? "#ecfdf5" : "#f9fafb"}; border-radius: 10px; border: 1px solid ${i === 0 ? "#a7f3d0" : "#e5e7eb"};">
      <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; background: ${i === 0 ? "#10b981" : "#d1d5db"}; color: white; font-size: 12px; font-weight: 700; margin-right: 10px;">${i + 1}</span>
      <span style="font-size: 14px; color: #374151;">${escapeHtml(item)}</span>
      ${i === 0 ? '<span style="margin-left: 8px; padding: 2px 8px; background: #d1fae5; color: #065f46; border-radius: 8px; font-size: 11px; font-weight: 600;">Start here</span>' : ""}
    </div>`).join("");

  // --- JSON-LD Blocks (paid: all, free: first only) ---
  const jsonLdToShow = isPaid ? (score.generated_json_ld || []) : (score.generated_json_ld || []).slice(0, 1);
  const jsonLdHTML = jsonLdToShow.map((block) => `
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="padding: 12px 16px; background: #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 13px; font-weight: 600; color: #1f2937;">${escapeHtml(block.label)}</span>
        <span style="padding: 2px 10px; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 11px; font-weight: 600;">${escapeHtml(block.type)}</span>
      </div>
      <div style="padding: 8px 16px; font-size: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb; line-height: 1.5;">
        ${escapeHtml(block.description)}
      </div>
      <pre style="margin: 0; padding: 16px; background: #111827; color: #4ade80; font-size: 12px; font-family: 'SF Mono', Monaco, monospace; overflow-x: auto; white-space: pre-wrap; word-break: break-word;">&lt;script type="application/ld+json"&gt;
${escapeHtml(block.code)}
&lt;/script&gt;</pre>
    </div>`).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GEO/AEO Report for ${escapeHtml(domain)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
      background: #f5f5f7; color: #1d1d1f;
    }
    .header {
      background: linear-gradient(135deg, ${scoreColor} 0%, #06b6d4 100%);
      color: white; padding: 48px 20px; text-align: center;
    }
    .header h1 { margin: 0 0 8px 0; font-size: 36px; font-weight: 700; }
    .header .subtitle { margin: 0; font-size: 18px; opacity: 0.9; }
    .score-large { font-size: 72px; font-weight: 800; margin: 16px 0 8px 0; }
    .tier { font-size: 24px; font-weight: 600; opacity: 0.9; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .card {
      background: white; border-radius: 16px; padding: 32px;
      margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .card h2 { margin: 0 0 20px 0; font-size: 22px; font-weight: 700; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
    .section-scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .score-item { background: #f5f5f7; padding: 16px; border-radius: 12px; }
    .score-item-label { font-size: 13px; color: #86868b; text-transform: uppercase; margin-bottom: 8px; }
    .score-item-value { font-size: 28px; font-weight: 700; color: #0071e3; }
    .progress-bar { background: #e8e8ed; height: 8px; border-radius: 4px; margin-top: 8px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 4px; }

    .page-card { border-left: 4px solid #0071e3; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .page-url { font-size: 14px; color: #6e6e73; word-break: break-all; }
    .page-badges { display: flex; gap: 8px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-type { background: #e8e8ed; color: #6e6e73; }
    .badge-score { background: #0071e3; color: white; }
    .change-card { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
    .change-header { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
    .priority-high { background: #fee2e2; color: #dc2626; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-low { background: #dbeafe; color: #2563eb; }
    .change-type { background: #e5e7eb; color: #6b7280; }
    .change-label { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
    .placement { font-size: 13px; color: #6e6e73; margin-bottom: 12px; }
    .placement strong { color: #1d1d1f; }
    .copy-block {
      background: white; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 13px;
      line-height: 1.6; white-space: pre-wrap; word-break: break-word;
    }
    .jsonld-details { margin-top: 12px; background: #1d1d1f; border-radius: 8px; padding: 16px; overflow-x: auto; }
    .jsonld-details summary { cursor: pointer; color: #00c6ff; font-size: 13px; font-weight: 600; }
    .jsonld-details pre { margin: 12px 0 0 0; color: #00ff00; font-size: 12px; white-space: pre-wrap; word-break: break-word; }

    .citation-box {
      display: flex; align-items: center; gap: 24px; padding: 24px;
      background: #faf5ff; border: 2px solid #e9d5ff; border-radius: 16px; margin-bottom: 24px;
    }
    .citation-number { font-size: 52px; font-weight: 800; }

    .upsell {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #f59e0b; border-radius: 16px; padding: 32px; text-align: center;
    }
    .upsell h3 { margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #92400e; }
    .upsell p { margin: 0 0 20px 0; font-size: 16px; color: #78350f; }
    .upsell-btn { display: inline-block; background: #92400e; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; }

    .footer { text-align: center; padding: 32px 20px; color: #86868b; font-size: 13px; }
    .footer a { color: #0071e3; text-decoration: none; }

    @media print {
      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; margin-bottom: 8px;">
      ${isPaid ? "GEO/AEO Full Report" : "GEO/AEO Report Preview"}
    </div>
    <h1>GEO Analyzer Report</h1>
    <p class="subtitle">${escapeHtml(domain)}</p>
    <div class="score-large">${score.overall_score}</div>
    <div class="tier">${score.tier}</div>
    <p style="margin: 16px 0 0 0; opacity: 0.8; font-size: 14px;">
      Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </p>
  </div>

  <div class="container">

    <!-- AI Citation Probability -->
    ${citationScore > 0 ? `
    <div class="citation-box">
      <div class="citation-number" style="color: ${citationColor.bg};">${citationScore}%</div>
      <div>
        <strong style="font-size: 18px; color: #1f2937;">AI Citation Probability</strong>
        <span style="display: inline-block; margin-left: 8px; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${citationColor.bg}20; color: ${citationColor.text};">${citationColor.label}</span>
        <p style="color: #6b7280; font-size: 14px; margin: 6px 0 0; line-height: 1.5;">
          Estimated likelihood that AI assistants will cite your site when answering relevant queries, based on entity clarity, content structure, trust signals, and technical markup.
        </p>
      </div>
    </div>
    ` : ""}

    <!-- Section Score Breakdown -->
    <div class="card">
      <h2>Score Breakdown</h2>
      <div class="section-scores">
        ${[
          { label: "Entity Clarity", score: score.section_scores.entity_clarity, weight: "30%" },
          { label: "Direct Answers", score: score.section_scores.direct_answers, weight: "30%" },
          { label: "Trust Signals", score: score.section_scores.trust_signals, weight: "20%" },
          { label: "Competitive Positioning", score: score.section_scores.competitive_positioning, weight: "10%" },
          { label: "Technical Accessibility", score: score.section_scores.technical_accessibility, weight: "10%" },
        ].map((s) => `
        <div class="score-item">
          <div class="score-item-label">${s.label} <span style="font-size: 11px; color: #b0b0b5;">(${s.weight})</span></div>
          <div class="score-item-value" style="color: ${getScoreColor(s.score)};">${s.score}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${s.score}%; background: ${getScoreColor(s.score)};"></div>
          </div>
        </div>`).join("")}
      </div>
    </div>

    <!-- How AI Sees You — Query Simulations -->
    ${querySimsHTML ? `
    <div class="card">
      <h2>How AI Sees You &mdash; Query Simulation</h2>
      <p style="font-size: 14px; color: #6b7280; margin: -12px 0 20px;">
        We simulated ${score.ai_query_simulations?.length || 0} queries relevant to your site. Here's whether AI would mention you:
      </p>
      ${querySimsHTML}
    </div>
    ` : ""}

    <!-- AI Hesitations -->
    ${hesitationsHTML ? `
    <div class="card">
      <h2>AI Hesitations</h2>
      <p style="font-size: 14px; color: #6b7280; margin: -12px 0 20px;">
        Key reasons AI assistants might hesitate to cite or recommend your site.
      </p>
      ${hesitationsHTML}
    </div>
    ` : ""}

    <!-- Week 1 Fix Roadmap -->
    ${fixPlanHTML ? `
    <div class="card">
      <h2>Week 1 Fix Roadmap</h2>
      <p style="font-size: 14px; color: #6b7280; margin: -12px 0 20px;">
        Prioritized action items to improve your AI readiness this week.
      </p>
      ${fixPlanHTML}
    </div>
    ` : ""}

    <!-- Ready-to-Paste JSON-LD Schema -->
    ${jsonLdHTML ? `
    <div class="card">
      <h2>Ready-to-Paste Schema Markup</h2>
      <p style="font-size: 14px; color: #6b7280; margin: -12px 0 20px;">
        Add these to your site's &lt;head&gt; section. Each block improves how AI engines understand and cite your content.
      </p>
      ${jsonLdHTML}
    </div>
    ` : ""}

    <!-- Page-by-Page Remediations -->
    <h2 style="font-size: 28px; font-weight: 700; margin: 32px 0 24px 0; color: #1d1d1f;">
      Page-by-Page Remediations
      ${!isPaid && totalPages > 1 ? `<span style="font-size: 18px; font-weight: 400; color: #f59e0b;"> (1 of ${totalPages} shown)</span>` : ""}
    </h2>

    ${pagesHTML}

    ${!isPaid && totalPages > 1 ? `
    <div class="upsell">
      <h3>Unlock the Full Report</h3>
      <p>Get all ${totalPages} page remediations, all AI hesitations, complete fix roadmap, and every JSON-LD block.</p>
      <a href="https://geo-analyzer.com/pricing" class="upsell-btn">Upgrade to Full Report &mdash; $19</a>
    </div>
    ` : ""}

  </div>

  <div class="footer">
    <p>This is a diagnostic report, not an exhaustive audit. Results are based on automated analysis.</p>
    <p>For questions, <a href="mailto:hello@maxpetrusenko.com">email us</a>.</p>
    <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} GEO/AEO Analyzer. All rights reserved.</p>
  </div>

</body>
</html>
  `;
}

function generatePageRemediationHTML(
  page: PageRemediation,
  pageNumber: number,
): string {
  const changesHTML = page.recommended_changes
    .map((change) => generateChangeHTML(change))
    .join("");

  return `
    <div class="card page-card">
      <div class="page-header">
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Page ${pageNumber}</h3>
          <p class="page-url">${page.url}</p>
        </div>
        <div class="page-badges">
          <span class="badge badge-type">${page.page_type}</span>
          ${page.diagnosis.page_score !== undefined ? `<span class="badge badge-score">Score: ${page.diagnosis.page_score}</span>` : ""}
        </div>
      </div>

      <div style="margin-bottom: 20px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #92400e; text-transform: uppercase; font-weight: 600;">
          Why AI Hesitates
        </p>
        <p style="margin: 0; color: #78350f; font-size: 15px;">
          ${page.diagnosis.ai_hesitation}
        </p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #92400e;">
          <strong>Primary Issue:</strong> ${page.diagnosis.dominant_gap.replace(/_/g, " ")}
        </p>
      </div>

      <h4 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
        Recommended Changes (${page.recommended_changes.length})
      </h4>

      ${changesHTML}
    </div>
  `;
}

function generateChangeHTML(change: {
  priority: "high" | "medium" | "low";
  change_type: string;
  placement: string;
  exact_example_text: string;
  example_json_ld?: string;
}): string {
  const priorityColors: Record<string, string> = {
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };

  return `
    <div class="change-card">
      <div class="change-header">
        <span class="change-label ${priorityColors[change.priority] || ""}">${change.priority.toUpperCase()}</span>
        <span class="change-label change-type">${change.change_type.replace(/_/g, " ")}</span>
      </div>

      <p class="placement">
        <strong>Placement:</strong> ${change.placement}
      </p>

      <p style="margin: 0 0 8px 0; font-size: 13px; color: #86868b;">Copy to add:</p>
      <div class="copy-block">${escapeHtml(change.exact_example_text)}</div>

      ${
        change.example_json_ld
          ? `
      <details class="jsonld-details">
        <summary>View JSON-LD Schema</summary>
        <pre>${escapeHtml(change.example_json_ld)}</pre>
      </details>
      `
          : ""
      }
    </div>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}
