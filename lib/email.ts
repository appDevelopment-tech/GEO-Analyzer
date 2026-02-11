import formData from "form-data";
import Mailgun from "mailgun.js";
import { GeoScore } from "@/types/geo";
import { generatePdfReport, pdfFilename } from "@/lib/pdf";
import { createClient } from "@supabase/supabase-js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

export async function sendReport(
  email: string,
  domain: string,
  score: GeoScore,
  reportId: string,
): Promise<void> {
  const shortEmailBody = generateShortEmailBody(domain, score);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
  );

  // Generate PDF — no fallback, this must work
  const pdfName = pdfFilename(domain);
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePdfReport(score as any, domain);
    console.log(
      `PDF generated: ${pdfName} (${pdfBuffer.length} bytes)`,
    );
  } catch (pdfErr) {
    console.error("PDF generation failed:", pdfErr);
    // Update Supabase with the error so we can debug
    if (reportId) {
      await supabase
        .from("Reports")
        .update({
          email_result: `pdf_error: ${pdfErr instanceof Error ? pdfErr.message : String(pdfErr)}`,
        })
        .eq("report_id", reportId);
    }
    throw pdfErr;
  }

  let emailResult: string | boolean = true;
  try {
    const messageData: any = {
      from: `GEO Analyzer <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: `Your GEO Report for ${domain} (Score: ${score.overall_score}/100)`,
      html: shortEmailBody,
      attachment: [{ filename: pdfName, data: pdfBuffer }],
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", messageData);
    emailResult = true;
  } catch (error) {
    console.error("Failed to send email:", error);
    emailResult = error instanceof Error ? error.message : String(error);
  }

  // Update Supabase Reports.email_result
  if (reportId) {
    await supabase
      .from("Reports")
      .update({ email_result: emailResult })
      .eq("report_id", reportId);
  }

  if (emailResult !== true) {
    throw new Error("Failed to send report email");
  }
}

function generateShortEmailBody(
  domain: string,
  score: GeoScore,
): string {
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
        📎 Your Full Report is Attached
      </h3>
      <p style="margin: 0 0 12px 0; color: #6e6e73; font-size: 15px; line-height: 1.6;">
        Open the attached <b>PDF</b> to see your complete analysis:
      </p>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #6e6e73; font-size: 14px; line-height: 1.8;">
        <li>Score breakdown across 5 dimensions</li>
        <li>Why AI hesitates to recommend your site</li>
        <li>Week-1 quick-fix action plan</li>
        <li>AI query simulations</li>
        <li>Structured data &amp; FAQ analysis</li>
      </ul>
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
