/**
 * Report Generation Module
 *
 * Generates HTML reports from GEO analysis
 */

import type { CrawlData, GeoScore } from "@/types/geo";

export interface ReportOptions {
  domain: string;
  analysis: GeoScore;
  crawlData: CrawlData[];
  tier?: "free" | "paid";
}

/**
 * Generate HTML report from analysis
 */
export function generateHTMLReport(opts: ReportOptions): string {
  const { domain, analysis, crawlData } = opts;
  const domainClean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Score color
  const scoreColor =
    analysis.overall_score >= 75
      ? "#10b981" // green
      : analysis.overall_score >= 50
        ? "#f59e0b" // orange
        : "#ef4444"; // red

  // Generate hesitations HTML
  const hesitationsHTML =
    analysis.top_ai_hesitations.length > 0
      ? analysis.top_ai_hesitations
          .map(
            (h) => `
        <div class="hesitation">
          <h3>${h.issue}</h3>
          <p><strong>Why AI hesitates:</strong> ${h.why_ai_hesitates}</p>
          ${h.evidence.length > 0 ? `<p><strong>Evidence:</strong> ${h.evidence.join(", ")}</p>` : ""}
        </div>
      `
          )
          .join("")
      : '<p class="info">No major hesitations identified!</p>';

  // Generate fixes HTML
  const fixesHTML =
    analysis.week1_fix_plan.length > 0
      ? analysis.week1_fix_plan.map((fix) => `<li>${fix}</li>`).join("")
      : "<li>No specific fixes identified - site is in good shape!</li>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GEO Analysis Report - ${domainClean}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #1d1d1f;
    }
    .score-card {
      background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%);
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      margin-bottom: 40px;
    }
    .score-card .label {
      margin: 0 0 8px 0;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 14px;
    }
    .score-card .score {
      font-size: 72px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }
    .score-card .tier {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .section { margin: 40px 0; }
    .section h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }
    .hesitation {
      background: #f5f5f7;
      padding: 16px 20px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .hesitation h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #1d1d1f;
    }
    .hesitation p {
      margin: 8px 0;
      color: #6e6e73;
    }
    .fixes { background: #f0fdf4; padding: 20px; border-radius: 8px; }
    .fixes ul { margin: 0; padding-left: 20px; }
    .fixes li { margin: 8px 0; }
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    .score-item {
      background: #f5f5f7;
      padding: 16px;
      border-radius: 8px;
    }
    .score-item .name {
      font-size: 12px;
      text-transform: uppercase;
      color: #86868b;
      margin: 0 0 4px 0;
    }
    .score-item .value {
      font-size: 32px;
      font-weight: 700;
      color: #0071e3;
    }
    .score-item .bar {
      background: #e8e8ed;
      height: 4px;
      border-radius: 2px;
      margin-top: 8px;
      overflow: hidden;
    }
    .score-item .bar-fill {
      background: linear-gradient(90deg, #0071e3 0%, #00c6ff 100%);
      height: 100%;
      border-radius: 2px;
    }
    .footer {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid #d2d2d7;
      color: #86868b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="score-card">
    <p class="label">AI Recommendation Readiness</p>
    <div class="score">${analysis.overall_score}<span style="font-size:24px">/100</span></div>
    <p class="tier">${analysis.tier}</p>
    <p style="margin:8px 0 0 0; opacity:0.8;">for ${domainClean}</p>
  </div>

  <div class="section">
    <h2>Detailed Scores</h2>
    <div class="scores-grid">
      <div class="score-item">
        <p class="name">Entity Clarity (30%)</p>
        <p class="value">${analysis.section_scores.entity_clarity}</p>
        <div class="bar"><div class="bar-fill" style="width:${analysis.section_scores.entity_clarity}%"></div></div>
      </div>
      <div class="score-item">
        <p class="name">Direct Answers (30%)</p>
        <p class="value">${analysis.section_scores.direct_answers}</p>
        <div class="bar"><div class="bar-fill" style="width:${analysis.section_scores.direct_answers}%"></div></div>
      </div>
      <div class="score-item">
        <p class="name">Trust Signals (20%)</p>
        <p class="value">${analysis.section_scores.trust_signals}</p>
        <div class="bar"><div class="bar-fill" style="width:${analysis.section_scores.trust_signals}%"></div></div>
      </div>
      <div class="score-item">
        <p class="name">Competitive Positioning (10%)</p>
        <p class="value">${analysis.section_scores.competitive_positioning}</p>
        <div class="bar"><div class="bar-fill" style="width:${analysis.section_scores.competitive_positioning}%"></div></div>
      </div>
      <div class="score-item">
        <p class="name">Technical Accessibility (10%)</p>
        <p class="value">${analysis.section_scores.technical_accessibility}</p>
        <div class="bar"><div class="bar-fill" style="width:${analysis.section_scores.technical_accessibility}%"></div></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why AI Hesitates</h2>
    ${hesitationsHTML}
  </div>

  <div class="section fixes">
    <h2>Week 1 Fixes</h2>
    <ul>${fixesHTML}</ul>
  </div>

  <div class="footer">
    <p>Generated by GEO Analyzer</p>
    <p>${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>`;
}
