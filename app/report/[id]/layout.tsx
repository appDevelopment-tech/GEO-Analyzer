import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );

    const { data } = await supabase
      .from("Reports")
      .select("full_report, domain")
      .eq("report_id", params.id)
      .single();

    if (!data) return {};

    let report = data.full_report;
    if (typeof report === "string") {
      try { report = JSON.parse(report); } catch { /* */ }
    }

    const score = report?.overall_score ?? 0;
    const tier = report?.tier ?? "";
    const domain = (data.domain || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://geo-analyzer.com";
    const ogImageUrl = `${baseUrl}/api/og/${params.id}`;

    return {
      title: `${domain} — AI Score: ${score}/100 | GEO Analyzer`,
      description: `${tier}. See how AI ranks ${domain} across 5 visibility dimensions. Free analysis at GEO Analyzer.`,
      openGraph: {
        title: `${domain} scored ${score}/100 on AI visibility`,
        description: `${tier} — Entity Clarity, Direct Answers, Trust Signals, Competitive Positioning & Technical Accessibility.`,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${domain} — AI Visibility Score: ${score}/100`,
        description: `${tier}. Check your own score at geo-analyzer.com`,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {};
  }
}

export default function ReportLayout({ children }: Props) {
  return children;
}
