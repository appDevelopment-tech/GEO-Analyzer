import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_API_KEY!,
  );

  const { data } = await supabase
    .from("Reports")
    .select("full_report, domain")
    .eq("report_id", id)
    .single();

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  let report = data.full_report;
  if (typeof report === "string") {
    try { report = JSON.parse(report); } catch { /* */ }
  }

  const score = report?.overall_score ?? 0;
  const tier = report?.tier ?? "Unknown";
  const domain = (data.domain || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const sections = report?.section_scores || {};

  const scoreColor =
    score >= 75 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#eab308" : "#ef4444";

  const dimensions = [
    { label: "Entity Clarity", value: sections.entity_clarity || 0 },
    { label: "Direct Answers", value: sections.direct_answers || 0 },
    { label: "Trust Signals", value: sections.trust_signals || 0 },
    { label: "Competitive", value: sections.competitive_positioning || 0 },
    { label: "Technical", value: sections.technical_accessibility || 0 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          padding: "40px 60px",
        }}
      >
        {/* Top brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "absolute",
            top: "32px",
            left: "60px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            G
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, opacity: 0.9 }}>
            GEO Analyzer
          </span>
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: "24px",
            opacity: 0.6,
            marginBottom: "8px",
            letterSpacing: "0.5px",
          }}
        >
          {domain}
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontSize: "120px",
              fontWeight: 800,
              lineHeight: 1,
              color: scoreColor,
            }}
          >
            {score}
          </span>
          <span
            style={{ fontSize: "36px", fontWeight: 600, opacity: 0.5 }}
          >
            /100
          </span>
        </div>

        {/* Tier */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: scoreColor,
            marginBottom: "32px",
            padding: "6px 20px",
            borderRadius: "99px",
            border: `2px solid ${scoreColor}40`,
            background: `${scoreColor}15`,
          }}
        >
          {tier}
        </div>

        {/* Dimension bars */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {dimensions.map((d) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  opacity: 0.5,
                  textAlign: "center",
                }}
              >
                {d.label}
              </span>
              <div
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${d.value}%`,
                    height: "100%",
                    borderRadius: "4px",
                    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  textAlign: "center",
                  opacity: 0.8,
                }}
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "16px",
            opacity: 0.4,
          }}
        >
          Check your AI visibility score at geo-analyzer.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
      },
    },
  );
}
