import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { generatePdfReport, pdfFilename } from "@/lib/pdf";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing report id" }, { status: 400 });
    }

    // Fetch the report from Supabase
    const { data, error } = await supabase
      .from("Reports")
      .select("*")
      .eq("report_id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Parse full_report if it's a string
    let report = data.full_report;
    if (typeof report === "string") {
      try {
        report = JSON.parse(report);
      } catch {
        return NextResponse.json(
          { error: "Invalid report data" },
          { status: 500 },
        );
      }
    }

    // Parse report_details if available (paid deep analysis)
    let reportDetails = null;
    if (data.report_details) {
      try {
        reportDetails =
          typeof data.report_details === "string"
            ? JSON.parse(data.report_details)
            : data.report_details;
      } catch {
        // Non-fatal: generate PDF without deep analysis
        console.warn("Failed to parse report_details for PDF generation");
      }
    }

    const domain = data.domain || "Unknown";

    // Generate PDF — includes deep analysis sections if report_details exists
    const pdfBuffer = await generatePdfReport(report, domain, reportDetails);
    const filename = pdfFilename(domain);

    // Return PDF as downloadable response
    const body = new Uint8Array(pdfBuffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: err.message || "PDF generation failed" },
      { status: 500 },
    );
  }
}
