import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const reportId = req.nextUrl.searchParams.get("id");
  if (!reportId) {
    return NextResponse.json({ error: "Missing report id" }, { status: 400 });
  }

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
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Only allow PDF for paid reports
  if (data.payment_status !== "paid") {
    return NextResponse.json(
      { error: "PDF export is available for paid reports only" },
      { status: 403 },
    );
  }

  let report = data.full_report;
  if (typeof report === "string") {
    try {
      report = JSON.parse(report);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse report" },
        { status: 500 },
      );
    }
  }

  const domain = data.domain
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  const html = generatePdfHtml(report, domain);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="geo-report-${domain}.html"`,
    },
  });
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function generatePdfHtml(report: any, domain: string): string {
  const scoreColor = getScoreColor(report.overall_score || 0);
  const citationScore = report.ai_citation_score || 0;

  const sectionRows = [
    { label: "Entity Clarity", score: report.section_scores?.entity_clarity || 0, weight: "30%" },
    { label: "Direct Answers", score: report.section_scores?.direct_answers || 0, weight: "30%" },
    { label: "Trust Signals", score: report.section_scores?.trust_signals || 0, weight: "20%" },
    { label: "Competitive Positioning", score: report.section_scores?.competitive_positioning || 0, weight: "10%" },
    { label: "Technical Accessibility", score: report.section_scores?.technical_accessibility || 0, weight: "10%" },
  ];

  const hesitations = (report.top_ai_hesitations || [])
    .map(
      (h: any) => `
      <div style="margin-bottom:16px;padding:16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0">
        <strong style="color:#1f2937">${h.issue}</strong>
        <p style="color:#4b5563;margin:8px 0 0;font-size:14px">${h.why_ai_hesitates}</p>
      </div>`,
    )
    .join("");

  const fixPlan = (report.week1_fix_plan || [])
    .map(
      (item: string, i: number) =>
        `<li style="margin-bottom:8px;padding:8px 12px;background:${i === 0 ? "#ecfdf5" : "#f9fafb"};border-radius:8px;font-size:14px;color:#374151">
          <strong>${i + 1}.</strong> ${item}
        </li>`,
    )
    .join("");

  const queryResults = (report.ai_query_simulations || [])
    .map(
      (sim: any) => `
      <div style="margin-bottom:12px;padding:12px 16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">
        <div style="font-size:14px;font-weight:600;color:#1f2937;margin-bottom:4px">&ldquo;${sim.query}&rdquo;</div>
        <span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;background:${sim.mentioned ? "#dcfce7;color:#166534" : "#fee2e2;color:#991b1b"}">
          ${sim.mentioned ? "Mentioned" : "Not Found"}${sim.position ? ` — ${sim.position}${sim.position === 1 ? "st" : sim.position === 2 ? "nd" : sim.position === 3 ? "rd" : "th"}` : ""}
        </span>
        <p style="font-size:13px;color:#6b7280;margin-top:8px;font-style:italic">${sim.snippet}</p>
      </div>`,
    )
    .join("");

  const jsonLdBlocks = (report.generated_json_ld || [])
    .map(
      (block: any) => `
      <div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <div style="padding:12px 16px;background:#f3f4f6;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13px;font-weight:600;color:#1f2937">${block.label}</span>
          <span style="padding:2px 8px;background:#dbeafe;color:#1e40af;border-radius:12px;font-size:11px;font-weight:600">${block.type}</span>
        </div>
        <div style="padding:8px 16px;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb">${block.description}</div>
        <pre style="margin:0;padding:16px;background:#111827;color:#4ade80;font-size:12px;font-family:monospace;overflow-x:auto;white-space:pre-wrap">&lt;script type="application/ld+json"&gt;\n${block.code}\n&lt;/script&gt;</pre>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>GEO/AEO Report — ${domain}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; margin: 0; padding: 0; background: #fff; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { background: linear-gradient(135deg, ${scoreColor}, #06b6d4); padding: 48px 40px; border-radius: 16px; color: white; text-align: center; margin-bottom: 32px; }
    .score-big { font-size: 72px; font-weight: 800; margin: 0; }
    .tier { font-size: 20px; opacity: 0.9; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 22px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
    .bar-row { display: flex; align-items: center; margin-bottom: 12px; }
    .bar-label { width: 200px; font-size: 14px; font-weight: 500; }
    .bar-track { flex: 1; height: 12px; background: #f3f4f6; border-radius: 6px; overflow: hidden; margin: 0 12px; }
    .bar-fill { height: 100%; border-radius: 6px; }
    .bar-score { width: 40px; text-align: right; font-weight: 700; font-size: 14px; }
    .citation-box { display: flex; align-items: center; gap: 24px; padding: 24px; background: #faf5ff; border: 2px solid #e9d5ff; border-radius: 16px; }
    .citation-score { font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;opacity:0.8;margin-bottom:8px">GEO/AEO Full Report</div>
      <p class="score-big">${report.overall_score || 0}</p>
      <p class="tier">${report.tier || "Unscored"}</p>
      <div style="margin-top:8px;font-size:14px;opacity:0.8">${domain}</div>
    </div>

    <div class="section">
      <div class="citation-box">
        <div class="citation-score">${citationScore}%</div>
        <div>
          <strong style="font-size:16px">AI Citation Probability</strong>
          <p style="color:#6b7280;font-size:14px;margin:4px 0 0">Estimated likelihood that AI assistants cite your site for relevant queries.</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Score Breakdown</h2>
      ${sectionRows
        .map(
          (s) => `
        <div class="bar-row">
          <span class="bar-label">${s.label} <span style="color:#9ca3af;font-size:12px">(${s.weight})</span></span>
          <div class="bar-track"><div class="bar-fill" style="width:${s.score}%;background:${getScoreColor(s.score)}"></div></div>
          <span class="bar-score" style="color:${getScoreColor(s.score)}">${s.score}</span>
        </div>`,
        )
        .join("")}
    </div>

    ${
      hesitations
        ? `<div class="section"><h2>AI Hesitations</h2>${hesitations}</div>`
        : ""
    }

    ${
      queryResults
        ? `<div class="section"><h2>How AI Sees You — Query Simulation</h2>${queryResults}</div>`
        : ""
    }

    ${
      fixPlan
        ? `<div class="section"><h2>Week 1 Fix Roadmap</h2><ul style="list-style:none;padding:0;margin:0">${fixPlan}</ul></div>`
        : ""
    }

    ${
      jsonLdBlocks
        ? `<div class="section"><h2>Ready-to-Paste Schema Markup</h2>${jsonLdBlocks}</div>`
        : ""
    }

    <div class="footer">
      Generated by GeoAnalyzer &mdash; geo-analyzer.com &mdash; ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>
</body>
</html>`;
}

export const runtime = "nodejs";
