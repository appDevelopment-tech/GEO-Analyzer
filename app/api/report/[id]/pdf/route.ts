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

    const domain = data.domain || "Unknown";

    // Generate PDF
    const pdfBuffer = await generatePdfReport(report, domain);
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
