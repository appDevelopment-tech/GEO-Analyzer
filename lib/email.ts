import formData from "form-data";
import Mailgun from "mailgun.js";
import { GeoScore } from "@/types/geo";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

export async function sendReport(
  email: string,
  domain: string,
  score: GeoScore,
): Promise<void> {
  const htmlContent = generateReportHTML(domain, score);

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: `GEO Analyzer <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      cc: ["max.petrusenko@gmail.com"],
      subject: `Your AI Recommendation Readiness Report for ${domain}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send report email");
  }
}

function generateReportHTML(domain: string, score: GeoScore): string {
  const hesitationsHTML = score.top_ai_hesitations
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
            ${h.evidence.map((e) => `<li>${e}</li>`).join("")}
          </ul>
        </div>
      </div>
    `,
    )
    .join("");

  const fixPlanHTML = score.week1_fix_plan
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
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 32px; font-weight: 700;">
        GEO Analyzer
      </h1>
      <p style="margin: 0; color: #6e6e73; font-size: 16px;">
        AI Recommendation Readiness Report. If you have questions about the findings, just reply to this email.
      </p>
    </div>

    <!-- Score Card -->
    <div style="background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
      <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.8); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        Overall Score
      </p>
      <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 64px; font-weight: 700;">
        ${score.overall_score}
      </h2>
      <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">
        ${score.tier}
      </p>
    </div>

    <!-- Domain -->
    <p style="text-align: center; color: #86868b; font-size: 14px; margin-bottom: 32px;">
      Analysis for: <strong>${domain}</strong>
    </p>

    <!-- Section Scores -->
    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">
        Detailed Scores
      </h2>
      ${Object.entries(score.section_scores)
        .map(
          ([key, value]) => `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #1d1d1f; font-size: 15px; font-weight: 500; text-transform: capitalize;">
              ${key.replace(/_/g, " ")}
            </span>
            <span style="color: #0071e3; font-size: 15px; font-weight: 600;">
              ${value}
            </span>
          </div>
          <div style="background: #e8e8ed; border-radius: 4px; height: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #0071e3 0%, #00c6ff 100%); height: 100%; width: ${value}%; border-radius: 4px;"></div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Top AI Hesitations -->
    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">
        Top AI Hesitations
      </h2>
      ${hesitationsHTML}
    </div>

    <!-- Week 1 Fix Plan -->
    <div style="margin-bottom: 40px;">
      <h2 style="margin: 0 0 20px 0; color: #1d1d1f; font-size: 24px; font-weight: 700;">
        What to Fix First (Week 1)
      </h2>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">
        ${fixPlanHTML}
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
      <p style="margin: 0 0 8px 0; color: #86868b; font-size: 13px;">
        This is a diagnostic report, not an exhaustive audit. For more information, please contact <a href="mailto:max.petrusenko@gmail.com">me</a> directly.
      </p>
      <p style="margin: 0; color: #86868b; font-size: 13px;">
        © ${new Date().getFullYear()} GEO Analyzer. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}
