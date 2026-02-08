import formData from "form-data";
import Mailgun from "mailgun.js";
import { GeoScore, PageRemediation } from "@/types/geo";
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
  const pagesToShow = isPaid
    ? (score.page_remediations || []).length
    : Math.min(1, (score.page_remediations || []).length);

  // Generate short email body
  const shortEmailBody = generateShortEmailBody(domain, score, pagesToShow);

  // Generate detailed HTML attachment
  const detailedHTML = generateDetailedReportHTML(domain, score, isPaid);

  // Create temp file for attachment
  const filename = `geo-report-${domain.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.html`;
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
        subject: `Your GEO Report for ${domain} (Score: ${score.overall_score}/100)`,
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

function generateShortEmailBody(domain: string, score: GeoScore, pagesToShow: number): string {
  const isPaid = true; //we don't have free email!!
  const totalPages = score.page_remediations?.length || 0;

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
        Your AI Recommendation Readiness Report is ready
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
    </div>

    <!-- Attachment Notice -->
    <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <h3 style="margin: 0 0 12px 0; color: #1d1d1f; font-size: 18px; font-weight: 600;">
        📎 Detailed Report Attached
      </h3>
      <p style="margin: 0 0 12px 0; color: #6e6e73; font-size: 15px; line-height: 1.6;">
        Your full remediation report with specific recommendations is attached as an HTML file. Open it in any browser to see:
      </p>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #6e6e73; font-size: 14px; line-height: 1.8;">
        <li>Per-page analysis with scores</li>
        <li>Exact copy you can add to each page</li>
        <li>JSON-LD schema examples ready to implement</li>
        <li>Placement instructions for each change</li>
      </ul>
      ${!isPaid && totalPages > 1 ? `
      <div style="margin-top: 20px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
          Free Report Preview
        </p>
        <p style="margin: 0; color: #78350f; font-size: 13px;">
          This free report shows remediation for 1 of ${totalPages} pages analyzed. Upgrade to get all ${totalPages} pages.
        </p>
      </div>
      ` : ''}
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
          ${totalPages} page${totalPages !== 1 ? 's' : ''} analyzed (${isPaid ? 'all included' : `1 shown in free report`})
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #d2d2d7;">
      <p style="margin: 0 0 8px 0; color: #86868b; font-size: 13px;">
        Questions? Just reply to this email.
      </p>
      <p style="margin: 0; color: #86868b; font-size: 13px;">
        © ${new Date().getFullYear()} GEO/AEO Analyzer. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

function generateDetailedReportHTML(domain: string, score: GeoScore, isPaid: boolean): string {
  const pages = score.page_remediations || [];
  const pagesToShow = isPaid ? pages : pages.slice(0, 1);
  const totalPages = pages.length;

  // Generate per-page remediation HTML
  const pagesHTML = pagesToShow
    .map((page, pageIndex) => generatePageRemediationHTML(page, pageIndex + 1))
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GEO Report for ${domain}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
      background: #f5f5f7;
      color: #1d1d1f;
    }
    .header {
      background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%);
      color: white;
      padding: 48px 20px;
      text-align: center;
    }
    .header h1 { margin: 0 0 8px 0; font-size: 36px; font-weight: 700; }
    .header .subtitle { margin: 0; font-size: 18px; opacity: 0.9; }
    .score-large {
      font-size: 72px;
      font-weight: 700;
      margin: 16px 0 8px 0;
    }
    .tier { font-size: 24px; font-weight: 600; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .card h2 { margin: 0 0 24px 0; font-size: 24px; font-weight: 700; }
    .section-scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .score-item { background: #f5f5f7; padding: 16px; border-radius: 12px; }
    .score-item-label { font-size: 13px; color: #86868b; text-transform: uppercase; margin-bottom: 8px; }
    .score-item-value { font-size: 28px; font-weight: 700; color: #0071e3; }
    .progress-bar { background: #e8e8ed; height: 8px; border-radius: 4px; margin-top: 8px; overflow: hidden; }
    .progress-fill { background: linear-gradient(90deg, #0071e3 0%, #00c6ff 100%); height: 100%; }

    .page-card { border-left: 4px solid #0071e3; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .page-url { font-size: 14px; color: #6e6e73; word-break: break-all; }
    .page-badges { display: flex; gap: 8px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-type { background: #e8e8ed; color: #6e6e73; }
    .badge-score { background: #0071e3; color: white; }

    .change-card {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid #e5e7eb;
    }
    .change-header { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
    .priority-high { background: #fee2e2; color: #dc2626; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-low { background: #dbeafe; color: #2563eb; }
    .change-type { background: #e5e7eb; color: #6b7280; }
    .change-label { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
    .placement { font-size: 13px; color: #6e6e73; margin-bottom: 12px; }
    .placement strong { color: #1d1d1f; }

    .copy-block {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 16px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .jsonld-details {
      margin-top: 12px;
      background: #1d1d1f;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
    }
    .jsonld-details summary {
      cursor: pointer;
      color: #00c6ff;
      font-size: 13px;
      font-weight: 600;
    }
    .jsonld-details pre {
      margin: 12px 0 0 0;
      color: #00ff00;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .upsell {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #f59e0b;
      border-radius: 16px;
      padding: 32px;
      text-align: center;
    }
    .upsell h3 { margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #92400e; }
    .upsell p { margin: 0 0 20px 0; font-size: 16px; color: #78350f; }
    .upsell-btn {
      display: inline-block;
      background: #92400e;
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      padding: 32px 20px;
      color: #86868b;
      font-size: 13px;
    }
    .footer a { color: #0071e3; text-decoration: none; }

    @media print {
      .upsell, .header { background: #0071e3 !important; -webkit-print-color-adjust: exact; }
      body { background: white; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>GEO Analyzer Report</h1>
    <p class="subtitle">${domain}</p>
    <div class="score-large">${score.overall_score}</div>
    <div class="tier">${score.tier}</div>
    <p style="margin: 16px 0 0 0; opacity: 0.8;">
      Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>

  <div class="container">

    <!-- Section Scores -->
    <div class="card">
      <h2>Overall Assessment</h2>
      <div class="section-scores">
        <div class="score-item">
          <div class="score-item-label">Entity Clarity</div>
          <div class="score-item-value">${score.section_scores.entity_clarity}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score.section_scores.entity_clarity}%"></div>
          </div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Direct Answers</div>
          <div class="score-item-value">${score.section_scores.direct_answers}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score.section_scores.direct_answers}%"></div>
          </div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Trust Signals</div>
          <div class="score-item-value">${score.section_scores.trust_signals}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score.section_scores.trust_signals}%"></div>
          </div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Competitive Positioning</div>
          <div class="score-item-value">${score.section_scores.competitive_positioning}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score.section_scores.competitive_positioning}%"></div>
          </div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Technical Accessibility</div>
          <div class="score-item-value">${score.section_scores.technical_accessibility}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score.section_scores.technical_accessibility}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Remediations -->
    <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 24px 0; color: #1d1d1f;">
      Page-by-Page Remediations
      ${!isPaid && totalPages > 1 ? `<span style="font-size: 18px; font-weight: 400; color: #f59e0b;"> (1 of ${totalPages} shown)</span>` : ''}
    </h2>

    ${pagesHTML}

    ${!isPaid && totalPages > 1 ? `
    <!-- Upsell for Free Users -->
    <div class="upsell">
      <h3>🔓 Unlock All ${totalPages} Page Remediations</h3>
      <p>You have ${totalPages - 1} more pages with detailed recommendations waiting.</p>
      <p style="font-size: 14px;">Get exact copy, JSON-LD examples, and placement instructions for every page.</p>
      <a href="https://geo-analyzer.com/pricing" class="upsell-btn">Upgrade to Full Report - $19.50</a>
    </div>
    ` : ''}

  </div>

  <div class="footer">
    <p>This is a diagnostic report, not an exhaustive audit.</p>
    <p>For questions, <a href="mailto:hello@maxpetrusenko.com">email us</a>.</p>
    <p style="margin-top: 8px;">© ${new Date().getFullYear()} GEO Analyzer. All rights reserved.</p>
  </div>

</body>
</html>
  `;
}

function generatePageRemediationHTML(page: PageRemediation, pageNumber: number): string {
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
          ${page.diagnosis.page_score !== undefined ? `<span class="badge badge-score">Score: ${page.diagnosis.page_score}</span>` : ''}
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
          <strong>Primary Issue:</strong> ${page.diagnosis.dominant_gap.replace(/_/g, ' ')}
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
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  return `
    <div class="change-card">
      <div class="change-header">
        <span class="change-label ${priorityColors[change.priority] || ''}">${change.priority.toUpperCase()}</span>
        <span class="change-label change-type">${change.change_type.replace(/_/g, ' ')}</span>
      </div>

      <p class="placement">
        <strong>Placement:</strong> ${change.placement}
      </p>

      <p style="margin: 0 0 8px 0; font-size: 13px; color: #86868b;">Copy to add:</p>
      <div class="copy-block">${escapeHtml(change.exact_example_text)}</div>

      ${change.example_json_ld ? `
      <details class="jsonld-details">
        <summary>View JSON-LD Schema</summary>
        <pre>${escapeHtml(change.example_json_ld)}</pre>
      </details>
      ` : ''}
    </div>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}
