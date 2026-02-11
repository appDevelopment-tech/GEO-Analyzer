// Use standalone build: fonts are embedded, no fs.readFileSync(__dirname) needed.
// This ensures PDF generation works on Netlify/Vercel serverless functions.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require("pdfkit/js/pdfkit.standalone.js");

// ── Brand colours ───────────────────────────────────────────
const BLUE = "#0071e3";
const DARK = "#1d1d1f";
const GRAY_TEXT = "#6e6e73";
const LIGHT_GRAY = "#86868b";
const BG_LIGHT = "#f5f5f7";
const BORDER = "#d2d2d7";
const RED = "#dc2626";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const LIGHT_RED = "#fee2e2";
const LIGHT_AMBER = "#fef3c7";
const LIGHT_GREEN = "#dcfce7";
const LIGHT_BLUE = "#dbeafe";
const WHITE = "#ffffff";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 54;
const CONTENT_W = PAGE_W - MARGIN * 2;

const scoreColor = (score: number): string => {
  if (score >= 75) return GREEN;
  if (score >= 50) return AMBER;
  return RED;
};

const scoreBg = (score: number): string => {
  if (score >= 75) return LIGHT_GREEN;
  if (score >= 50) return LIGHT_AMBER;
  return LIGHT_RED;
};

const formatDate = (): string =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Generate a PDF report from the GeoScore data.
 * Pure Node.js — no Python or system dependencies required.
 * Returns a Buffer containing the PDF.
 */
export async function generatePdfReport(
  data: Record<string, any>,
  domain: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 48, bottom: 48, left: MARGIN, right: MARGIN },
        bufferPages: true,
        info: {
          Title: `GEO Analyzer Report - ${domain}`,
          Author: "GEO Analyzer",
          Subject: "AI/AEO Visibility Audit",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const overall = data.overall_score || 0;
      const tier = data.tier || "Unknown";
      const sectionScores = data.section_scores || {};
      const hesitations = data.top_ai_hesitations || [];
      const fixPlan = data.week1_fix_plan || [];
      const limitations = data.limitations || [];
      const faqs = data.extracted_faqs || [];
      const jsonLd = data.extracted_json_ld || [];
      const queries = data.ai_query_simulations || [];

      // ────────── HELPER FUNCTIONS ──────────

      let currentPage = 0;

      const drawHeader = () => {
        if (currentPage > 0) {
          doc.save();
          doc.rect(0, 0, PAGE_W, 28).fill(BLUE);
          doc.font("Helvetica-Bold").fontSize(9).fillColor(WHITE);
          doc.text("GEO Analyzer Report", 36, 9, { lineBreak: false });
          doc.font("Helvetica").fontSize(8).fillColor(WHITE);
          doc.text(domain, PAGE_W - 36 - doc.widthOfString(domain), 10, {
            lineBreak: false,
          });
          doc.restore();
        }
      };

      const drawFooter = () => {
        doc.save();
        doc.font("Helvetica").fontSize(7.5).fillColor(LIGHT_GRAY);
        doc.text(
          `Generated ${formatDate()}  |  geo-analyzer.com  |  Confidential`,
          36,
          PAGE_H - 30,
          { lineBreak: false },
        );
        const pageText = `Page ${currentPage + 1}`;
        doc.text(
          pageText,
          PAGE_W - 36 - doc.widthOfString(pageText),
          PAGE_H - 30,
          { lineBreak: false },
        );
        doc.restore();
      };

      const newPage = () => {
        doc.addPage();
        currentPage++;
        drawHeader();
        drawFooter();
        doc.y = 48;
      };

      const checkSpace = (needed: number) => {
        if (doc.y + needed > PAGE_H - 60) {
          newPage();
        }
      };

      const drawRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        fill: string,
        stroke?: string,
      ) => {
        doc.save();
        doc.roundedRect(x, y, w, h, r);
        if (fill) doc.fill(fill);
        if (stroke) {
          doc.roundedRect(x, y, w, h, r).stroke(stroke);
        }
        doc.restore();
      };

      const drawProgressBar = (
        x: number,
        y: number,
        w: number,
        h: number,
        value: number,
        max: number,
        color: string,
      ) => {
        doc.save();
        doc.roundedRect(x, y, w, h, h / 2).fill("#e8e8ed");
        const filled = Math.max(0, Math.min(w * (value / max), w));
        if (filled > 0) {
          doc.roundedRect(x, y, filled, h, h / 2).fill(color);
        }
        doc.restore();
      };

      const heading1 = (text: string) => {
        checkSpace(36);
        doc.font("Helvetica-Bold").fontSize(22).fillColor(DARK);
        doc.text(text, MARGIN, doc.y, { width: CONTENT_W });
        doc.moveDown(0.4);
      };

      const heading2 = (text: string) => {
        checkSpace(30);
        doc.font("Helvetica-Bold").fontSize(16).fillColor(DARK);
        doc.text(text, MARGIN, doc.y, { width: CONTENT_W });
        doc.moveDown(0.3);
      };

      const heading3 = (text: string) => {
        checkSpace(24);
        doc.font("Helvetica-Bold").fontSize(13).fillColor(DARK);
        doc.text(text, MARGIN, doc.y, { width: CONTENT_W });
        doc.moveDown(0.2);
      };

      const bodyText = (text: string, color = DARK) => {
        doc.font("Helvetica").fontSize(10).fillColor(color);
        doc.text(text, MARGIN, doc.y, {
          width: CONTENT_W,
          align: "justify",
          lineGap: 2,
        });
        doc.moveDown(0.3);
      };

      const smallText = (text: string, color = GRAY_TEXT) => {
        doc.font("Helvetica").fontSize(9).fillColor(color);
        doc.text(text, MARGIN, doc.y, { width: CONTENT_W, lineGap: 1 });
        doc.moveDown(0.2);
      };

      const captionText = (text: string) => {
        doc.font("Helvetica").fontSize(8).fillColor(LIGHT_GRAY);
        doc.text(text, MARGIN, doc.y, { width: CONTENT_W, lineGap: 1 });
        doc.moveDown(0.15);
      };

      const bulletPoint = (text: string, indent = 16) => {
        doc.font("Helvetica").fontSize(10).fillColor(DARK);
        doc.text(`•  ${text}`, MARGIN + indent, doc.y, {
          width: CONTENT_W - indent,
          lineGap: 2,
        });
        doc.moveDown(0.15);
      };

      const drawHR = () => {
        checkSpace(16);
        doc.save();
        doc
          .moveTo(MARGIN, doc.y)
          .lineTo(MARGIN + CONTENT_W, doc.y)
          .lineWidth(0.5)
          .stroke(BORDER);
        doc.restore();
        doc.y += 8;
      };

      const coloredBox = (
        text: string,
        bgColor: string,
        textColor: string,
        fontSize = 10,
      ) => {
        doc.font("Helvetica").fontSize(fontSize);
        const textH = doc.heightOfString(text, {
          width: CONTENT_W - 28,
          lineGap: 2,
        });
        const boxH = textH + 20;

        checkSpace(boxH + 8);
        const y = doc.y;

        drawRoundedRect(MARGIN, y, CONTENT_W, boxH, 6, bgColor, BORDER);
        doc.font("Helvetica").fontSize(fontSize).fillColor(textColor);
        doc.text(text, MARGIN + 14, y + 10, {
          width: CONTENT_W - 28,
          lineGap: 2,
        });
        doc.y = y + boxH + 6;
      };

      // ═══════════════ PAGE 1: COVER ═══════════════
      drawFooter();

      const coverBoxH = 320;
      const coverY = doc.y + 10;

      drawRoundedRect(MARGIN, coverY, CONTENT_W, coverBoxH, 12, BLUE);

      doc.font("Helvetica-Bold").fontSize(34).fillColor(WHITE);
      doc.text("GEO Analyzer", MARGIN, coverY + 30, {
        width: CONTENT_W,
        align: "center",
      });

      doc.font("Helvetica").fontSize(14).fillColor(WHITE);
      doc.text("AI / AEO Visibility Audit Report", MARGIN, doc.y + 2, {
        width: CONTENT_W,
        align: "center",
      });

      doc.moveDown(1.2);

      doc.font("Helvetica-Bold").fontSize(48).fillColor(WHITE);
      doc.text(String(overall), MARGIN, doc.y, {
        width: CONTENT_W,
        align: "center",
      });
      doc.font("Helvetica").fontSize(11).fillColor(WHITE);
      doc.text("/100", MARGIN, doc.y - 4, {
        width: CONTENT_W,
        align: "center",
      });

      doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(16).fillColor(WHITE);
      doc.text(tier, MARGIN, doc.y, { width: CONTENT_W, align: "center" });

      doc.moveDown(0.8);
      doc.font("Helvetica").fontSize(12).fillColor(WHITE);
      doc.text(domain, MARGIN, doc.y, { width: CONTENT_W, align: "center" });

      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(10).fillColor(WHITE);
      doc.text(`Generated ${formatDate()}`, MARGIN, doc.y, {
        width: CONTENT_W,
        align: "center",
      });

      doc.y = coverY + coverBoxH + 24;

      // Executive Summary
      heading2("Executive Summary");
      bulletPoint(
        `Overall AI-readiness score: ${overall}/100 (${tier})`,
      );
      bulletPoint(
        `Entity Clarity: ${sectionScores.entity_clarity || 0} | Direct Answers: ${sectionScores.direct_answers || 0} | Trust Signals: ${sectionScores.trust_signals || 0}`,
      );
      bulletPoint(
        `Top concern: ${hesitations[0]?.issue || "None identified"}`,
      );
      bulletPoint(
        `This report analyses ${domain} and provides actionable recommendations to improve visibility in AI-generated answers (ChatGPT, Perplexity, Claude, Gemini).`,
      );

      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(8).fillColor(LIGHT_GRAY);
      doc.text(
        "This is a diagnostic snapshot, not an exhaustive SEO audit. Scores are modelled on how large-language-model systems weigh structured data, entity signals, and answer quality when deciding which sources to cite.",
        MARGIN,
        doc.y,
        { width: CONTENT_W, lineGap: 1 },
      );

      // ═══════════════ PAGE 2: SCORES BREAKDOWN ═══════════════
      newPage();

      heading1("Score Breakdown");
      bodyText(
        "Each dimension is weighted to reflect how AI systems prioritise sources. Entity Clarity and Direct Answers carry the most weight (30% each), followed by Trust Signals (20%), Competitive Positioning (10%), and Technical Accessibility (10%).",
      );
      doc.moveDown(0.4);

      const scoreItems = [
        { label: "Entity Clarity", value: sectionScores.entity_clarity || 0 },
        { label: "Direct Answers", value: sectionScores.direct_answers || 0 },
        { label: "Trust Signals", value: sectionScores.trust_signals || 0 },
        {
          label: "Competitive Positioning",
          value: sectionScores.competitive_positioning || 0,
        },
        {
          label: "Technical Accessibility",
          value: sectionScores.technical_accessibility || 0,
        },
      ];

      for (const item of scoreItems) {
        const y = doc.y;
        const sc = scoreColor(item.value);

        doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
        doc.text(item.label, MARGIN, y, { lineBreak: false });

        drawProgressBar(MARGIN + 160, y + 2, 200, 10, item.value, 100, sc);

        doc.font("Helvetica-Bold").fontSize(12).fillColor(sc);
        doc.text(`${item.value}/100`, MARGIN + 380, y - 1, {
          lineBreak: false,
        });

        doc.y = y + 20;
        doc.save();
        doc
          .moveTo(MARGIN, doc.y)
          .lineTo(MARGIN + CONTENT_W, doc.y)
          .lineWidth(0.5)
          .stroke(BORDER);
        doc.restore();
        doc.y += 8;
      }

      doc.moveDown(0.6);

      // Dimension explanations
      const interpretations = [
        {
          key: "entity_clarity",
          title: "Entity Clarity",
          desc: "Measures how clearly your site communicates who you are, what you do, and where you operate. AI models need unambiguous entity signals to recommend you.",
        },
        {
          key: "direct_answers",
          title: "Direct Answers",
          desc: "Evaluates whether your content provides concise, factual answers that AI can extract and cite directly. FAQ blocks, step-by-step guides, and definition sections score well.",
        },
        {
          key: "trust_signals",
          title: "Trust Signals",
          desc: "Assesses verifiable trust markers: author credentials, privacy policies, contact information, reviews, and published dates. AI assistants avoid recommending sites that lack accountability.",
        },
        {
          key: "competitive_positioning",
          title: "Competitive Positioning",
          desc: "Gauges how well your site differentiates itself. Generic claims without specifics make AI prefer competitors with concrete evidence.",
        },
        {
          key: "technical_accessibility",
          title: "Technical Accessibility",
          desc: "Checks structured data (JSON-LD, Open Graph), clean HTML, mobile-friendliness, and whether content is machine-readable without JavaScript rendering.",
        },
      ];

      for (const interp of interpretations) {
        const val = sectionScores[interp.key] || 0;
        const sc = scoreColor(val);
        const bg = scoreBg(val);

        checkSpace(60);
        doc.font("Helvetica-Bold").fontSize(13).fillColor(sc);
        doc.text(`${interp.title}: ${val}/100`, MARGIN, doc.y);
        doc.moveDown(0.1);

        coloredBox(interp.desc, bg, DARK);
      }

      // ═══════════════ PAGE 3+: AI HESITATIONS ═══════════════
      newPage();

      heading1("Why AI Hesitates to Recommend You");
      bodyText(
        "These are the top reasons an AI assistant would hesitate before citing your site in a user-facing answer. Each issue includes supporting evidence extracted from your pages.",
      );
      doc.moveDown(0.3);

      for (let i = 0; i < Math.min(hesitations.length, 3); i++) {
        const h = hesitations[i];
        const issue = h.issue || "";
        const why = h.why_ai_hesitates || "";
        const evidence: string[] = h.evidence || [];
        const affected: string[] = h.affected_urls || [];

        checkSpace(80);
        heading3(`Issue ${i + 1}: ${issue}`);
        coloredBox(`Why AI Hesitates: ${why}`, LIGHT_AMBER, "#78350f");

        if (evidence.length > 0) {
          smallText("Evidence:");
          for (const ev of evidence.slice(0, 3)) {
            const evShort =
              ev.length > 200 ? ev.substring(0, 200) + "..." : ev;
            checkSpace(20);
            doc.font("Courier").fontSize(8).fillColor(GRAY_TEXT);
            doc.text(`•  ${evShort}`, MARGIN + 16, doc.y, {
              width: CONTENT_W - 16,
              lineGap: 1,
            });
            doc.moveDown(0.1);
          }
        }

        if (affected.length > 0) {
          captionText(`Affected: ${affected.slice(0, 3).join(", ")}`);
        }
        doc.moveDown(0.4);
      }

      // ═══════════════ WEEK-1 FIX PLAN ═══════════════
      drawHR();
      heading1("Week-1 Quick-Fix Plan");
      bodyText(
        "Prioritised action items you can implement this week to make the biggest improvement in your AI recommendation readiness.",
      );
      doc.moveDown(0.2);

      for (let i = 0; i < Math.min(fixPlan.length, 5); i++) {
        let badgeBg: string;
        let priority: string;
        if (i < 2) {
          badgeBg = LIGHT_RED;
          priority = "HIGH";
        } else if (i < 4) {
          badgeBg = LIGHT_AMBER;
          priority = "MEDIUM";
        } else {
          badgeBg = LIGHT_BLUE;
          priority = "LOW";
        }

        coloredBox(
          `[${priority}] Action ${i + 1}: ${fixPlan[i]}`,
          badgeBg,
          DARK,
        );
      }

      doc.moveDown(0.6);

      // AI Query Simulations
      if (queries.length > 0) {
        checkSpace(100);
        heading2("How AI Sees You: Query Simulations");
        bodyText(
          "We simulated five AI queries a user might ask and estimated whether your site would be cited in each response.",
        );
        doc.moveDown(0.2);

        const tableLeft = MARGIN;
        const colWidths = [300, 70, 70];
        const tableY = doc.y;

        drawRoundedRect(
          tableLeft,
          tableY,
          CONTENT_W,
          22,
          4,
          BG_LIGHT,
          BORDER,
        );
        doc.font("Helvetica-Bold").fontSize(9).fillColor(DARK);
        doc.text("Query", tableLeft + 8, tableY + 6, { lineBreak: false });
        doc.text("Cited?", tableLeft + colWidths[0] + 8, tableY + 6, {
          lineBreak: false,
        });
        doc.text(
          "Position",
          tableLeft + colWidths[0] + colWidths[1] + 8,
          tableY + 6,
          { lineBreak: false },
        );
        doc.y = tableY + 24;

        for (const q of queries.slice(0, 5)) {
          checkSpace(28);
          const rowY = doc.y;
          doc.font("Helvetica").fontSize(9).fillColor(GRAY_TEXT);
          doc.text(q.query || "", tableLeft + 8, rowY, {
            width: colWidths[0] - 16,
          });
          const rowBottom = doc.y;

          const cited = q.mentioned;
          doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(cited ? GREEN : RED);
          doc.text(cited ? "Yes" : "No", tableLeft + colWidths[0] + 8, rowY, {
            lineBreak: false,
          });

          doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
          const posText = q.position ? String(q.position) : "\u2014";
          doc.text(
            posText,
            tableLeft + colWidths[0] + colWidths[1] + 8,
            rowY,
            { lineBreak: false },
          );

          doc.y = rowBottom + 2;
          doc.save();
          doc
            .moveTo(tableLeft, doc.y)
            .lineTo(tableLeft + CONTENT_W, doc.y)
            .lineWidth(0.5)
            .stroke(BORDER);
          doc.restore();
          doc.y += 4;
        }
      }

      // ═══════════════ STRUCTURED DATA & TECHNICAL FINDINGS ═══════════════
      drawHR();
      heading1("Structured Data & Technical Findings");

      if (jsonLd.length > 0) {
        heading2("Detected JSON-LD Schemas");

        const typesFound = new Set<string>();
        for (const item of jsonLd) {
          if (typeof item === "object" && item) {
            const graph = item["@graph"] || [item];
            for (const g of graph) {
              if (typeof g === "object" && g && g["@type"]) {
                const t = g["@type"];
                if (Array.isArray(t)) {
                  t.forEach((tt: string) => typesFound.add(tt));
                } else {
                  typesFound.add(t);
                }
              }
            }
          }
        }

        if (typesFound.size > 0) {
          bodyText(
            `Schema types detected: ${Array.from(typesFound).sort().join(", ")}`,
          );
        } else {
          bodyText("JSON-LD data found but no standard @type detected.");
        }

        const fullLd = JSON.stringify(jsonLd[0], null, 2);
        let preview = fullLd.substring(0, 400);
        if (fullLd.length > 400) preview += "\n  ...";

        checkSpace(60);
        // Measure then draw bg then text
        doc.font("Courier").fontSize(7);
        const previewH = doc.heightOfString(preview, {
          width: CONTENT_W - 16,
          lineGap: 1,
        });
        const previewY = doc.y;
        drawRoundedRect(
          MARGIN,
          previewY,
          CONTENT_W,
          previewH + 8,
          4,
          BG_LIGHT,
        );
        doc.font("Courier").fontSize(7).fillColor(DARK);
        doc.text(preview, MARGIN + 8, previewY + 4, {
          width: CONTENT_W - 16,
          lineGap: 1,
        });
        doc.moveDown(0.3);
      } else {
        coloredBox(
          "No JSON-LD structured data detected. Adding Organization, WebSite, and FAQPage schemas is one of the highest-impact changes you can make.",
          LIGHT_RED,
          DARK,
        );
      }

      // FAQs
      if (faqs.length > 0) {
        heading2("Detected FAQ Content");
        bodyText(
          `Found ${faqs.length} FAQ / direct-answer blocks on the site. These are valuable for AI citation because they provide concise, extractable answers.`,
        );

        for (const faq of faqs) {
          let faqStr = String(faq);
          if (faqStr.length > 160) faqStr = faqStr.substring(0, 160) + "...";
          checkSpace(20);
          bulletPoint(faqStr);
        }
      } else {
        coloredBox(
          "No FAQ / direct-answer blocks detected. Adding an FAQ section with schema markup dramatically increases citation probability.",
          LIGHT_AMBER,
          DARK,
        );
      }

      doc.moveDown(0.3);

      // Limitations
      if (limitations.length > 0) {
        checkSpace(30);
        doc.font("Helvetica-Bold").fontSize(9).fillColor(GRAY_TEXT);
        doc.text("Limitations & Caveats", MARGIN, doc.y);
        doc.moveDown(0.1);
        captionText(limitations.join(" \u2022 "));
        doc.moveDown(0.3);
      }

      // Footer note
      drawHR();
      doc.font("Helvetica").fontSize(9).fillColor(LIGHT_GRAY);
      doc.text(
        "This report was generated by GEO Analyzer (geo-analyzer.com). For questions or support, contact hello@maxpetrusenko.com.",
        MARGIN,
        doc.y,
        { width: CONTENT_W, align: "center" },
      );

      // Finalize
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Build a safe filename for the PDF attachment.
 */
export function pdfFilename(domain: string): string {
  const clean = domain
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9.-]/gi, "-");
  return `geo-report-${clean}-${Date.now()}.pdf`;
}
