// Use standalone build: fonts are embedded, no fs.readFileSync(__dirname) needed.
// This ensures PDF generation works on Netlify/Vercel serverless functions.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require("pdfkit/js/pdfkit.standalone.js");

// ── Black & white palette ───────────────────────────────────
const BLACK = "#000000";
const DARK = "#1a1a1a";
const BODY = "#333333";
const GRAY = "#666666";
const LIGHT = "#999999";
const RULE = "#cccccc";
const BG = "#f2f2f2";
const WHITE = "#ffffff";

const PAGE_W = 612;
const PAGE_H = 792;
const ML = 54; // left margin
const MR = 54;
const CONTENT_W = PAGE_W - ML - MR; // 504

const scoreLabel = (s: number): string => {
  if (s >= 80) return "Strong";
  if (s >= 60) return "Moderate";
  if (s >= 40) return "Weak";
  return "Critical";
};

const fmtDate = (): string =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Generate a professional B&W consultant-style PDF report.
 * Pure Node.js (standalone PDFKit) — no filesystem or Python deps.
 */
export async function generatePdfReport(
  data: Record<string, any>,
  domain: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 72, bottom: 72, left: ML, right: MR },
        bufferPages: true,
        info: {
          Title: `GEO Analyzer — AI Visibility Audit — ${domain}`,
          Author: "GEO Analyzer",
          Subject: "AI/AEO Visibility Audit Report",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // ── Data extraction ──
      const overall: number = data.overall_score ?? 0;
      const tier: string = data.tier ?? "Unknown";
      const ss = data.section_scores ?? {};
      const hesitations: any[] = data.top_ai_hesitations ?? [];
      const fixPlan: string[] = data.week1_fix_plan ?? [];
      const limitations: string[] = data.limitations ?? [];
      const faqs: any[] = data.extracted_faqs ?? [];
      const jsonLd: any[] = data.extracted_json_ld ?? [];
      const queries: any[] = data.ai_query_simulations ?? [];
      const realCompetitors: any[] = data.real_competitors ?? [];
      const copyBlocks: any[] = data.copy_blocks ?? [];

      let pageNum = 0;

      // ── Helpers ──

      const header = () => {
        if (pageNum > 0) {
          doc.save();
          doc.font("Helvetica-Bold").fontSize(7).fillColor(LIGHT);
          doc.text("GEO ANALYZER", ML, 28, { lineBreak: false });
          doc.font("Helvetica").fontSize(7).fillColor(LIGHT);
          const right = `AI VISIBILITY AUDIT  —  ${domain.toUpperCase()}`;
          doc.text(right, PAGE_W - MR - doc.widthOfString(right), 28, {
            lineBreak: false,
          });
          doc
            .moveTo(ML, 42)
            .lineTo(PAGE_W - MR, 42)
            .lineWidth(0.5)
            .stroke(RULE);
          doc.restore();
        }
      };

      const footer = () => {
        doc.save();
        doc
          .moveTo(ML, PAGE_H - 50)
          .lineTo(PAGE_W - MR, PAGE_H - 50)
          .lineWidth(0.5)
          .stroke(RULE);
        doc.font("Helvetica").fontSize(7).fillColor(LIGHT);
        doc.text("Confidential", ML, PAGE_H - 42, { lineBreak: false });
        doc.text(`${fmtDate()}`, ML + 80, PAGE_H - 42, { lineBreak: false });
        const pg = `${pageNum + 1}`;
        doc.text(pg, PAGE_W - MR - doc.widthOfString(pg), PAGE_H - 42, {
          lineBreak: false,
        });
        doc.restore();
      };

      const addPage = () => {
        doc.addPage();
        pageNum++;
        header();
        footer();
        doc.y = 56;
      };

      const space = (n: number) => {
        if (doc.y + n > PAGE_H - 80) addPage();
        else doc.y += n;
      };

      const hr = (weight = 0.5, color = RULE) => {
        space(6);
        doc.save();
        doc.moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(weight).stroke(color);
        doc.restore();
        doc.y += 8;
      };

      const h1 = (text: string) => {
        if (doc.y + 36 > PAGE_H - 80) addPage();
        doc.font("Helvetica-Bold").fontSize(18).fillColor(BLACK);
        doc.text(text.toUpperCase(), ML, doc.y, { width: CONTENT_W, characterSpacing: 1 });
        doc.y += 4;
        doc.save();
        doc.moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(1.5).stroke(BLACK);
        doc.restore();
        doc.y += 12;
      };

      const h2 = (text: string) => {
        if (doc.y + 28 > PAGE_H - 80) addPage();
        doc.font("Helvetica-Bold").fontSize(12).fillColor(DARK);
        doc.text(text, ML, doc.y, { width: CONTENT_W });
        doc.y += 4;
      };

      const h3 = (text: string) => {
        if (doc.y + 22 > PAGE_H - 80) addPage();
        doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
        doc.text(text, ML, doc.y, { width: CONTENT_W });
        doc.y += 2;
      };

      const body = (text: string, indent = 0) => {
        doc.font("Helvetica").fontSize(9.5).fillColor(BODY);
        doc.text(text, ML + indent, doc.y, {
          width: CONTENT_W - indent,
          lineGap: 2.5,
        });
        doc.y += 4;
      };

      const small = (text: string, indent = 0) => {
        doc.font("Helvetica").fontSize(8).fillColor(GRAY);
        doc.text(text, ML + indent, doc.y, {
          width: CONTENT_W - indent,
          lineGap: 2,
        });
        doc.y += 3;
      };

      const mono = (text: string, indent = 0) => {
        doc.font("Courier").fontSize(7.5).fillColor(GRAY);
        doc.text(text, ML + indent, doc.y, {
          width: CONTENT_W - indent,
          lineGap: 1.5,
        });
        doc.y += 3;
      };

      const bullet = (text: string, indent = 14) => {
        if (doc.y + 16 > PAGE_H - 80) addPage();
        doc.font("Helvetica").fontSize(9.5).fillColor(BODY);
        doc.text(`\u2022  ${text}`, ML + indent, doc.y, {
          width: CONTENT_W - indent,
          lineGap: 2.5,
        });
        doc.y += 3;
      };

      const numberedItem = (n: number, text: string) => {
        if (doc.y + 20 > PAGE_H - 80) addPage();
        const startY = doc.y;
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor(DARK);
        doc.text(`${n}.`, ML, startY, { lineBreak: false });
        doc.font("Helvetica").fontSize(9.5).fillColor(BODY);
        doc.text(text, ML + 18, startY, {
          width: CONTENT_W - 18,
          lineGap: 2.5,
        });
        doc.y += 5;
      };

      // Gray box for callouts
      const grayBox = (text: string) => {
        doc.font("Helvetica").fontSize(9);
        const th = doc.heightOfString(text, { width: CONTENT_W - 24, lineGap: 2 });
        const bh = th + 16;
        if (doc.y + bh > PAGE_H - 80) addPage();
        const by = doc.y;
        doc.save();
        doc.rect(ML, by, CONTENT_W, bh).fill(BG);
        doc.restore();
        doc.font("Helvetica").fontSize(9).fillColor(BODY);
        doc.text(text, ML + 12, by + 8, { width: CONTENT_W - 24, lineGap: 2 });
        doc.y = by + bh + 6;
      };

      // ═══════════════════════════════════════════════════
      // PAGE 1 — COVER
      // ═══════════════════════════════════════════════════
      footer();

      // Top rule
      doc.save();
      doc.moveTo(ML, 72).lineTo(ML + CONTENT_W, 72).lineWidth(2).stroke(BLACK);
      doc.restore();

      doc.y = 96;

      // Brand name
      doc.font("Helvetica-Bold").fontSize(11).fillColor(LIGHT);
      doc.text("GEO ANALYZER", ML, doc.y, { characterSpacing: 3, width: CONTENT_W });

      doc.y += 28;

      // Title
      doc.font("Helvetica-Bold").fontSize(28).fillColor(BLACK);
      doc.text("AI Visibility", ML, doc.y, { width: CONTENT_W, lineGap: 2 });
      doc.text("Audit Report", ML, doc.y, { width: CONTENT_W, lineGap: 2 });

      doc.y += 20;

      // Thin rule
      doc.save();
      doc.moveTo(ML, doc.y).lineTo(ML + 80, doc.y).lineWidth(1).stroke(BLACK);
      doc.restore();
      doc.y += 20;

      // Domain
      doc.font("Helvetica").fontSize(13).fillColor(DARK);
      doc.text(domain, ML, doc.y, { width: CONTENT_W });
      doc.y += 8;
      doc.font("Helvetica").fontSize(10).fillColor(GRAY);
      doc.text(fmtDate(), ML, doc.y, { width: CONTENT_W });

      // Score block — right-aligned large number
      doc.y += 40;
      doc.font("Helvetica").fontSize(9).fillColor(LIGHT);
      doc.text("OVERALL SCORE", ML, doc.y, { width: CONTENT_W });
      doc.y += 6;
      doc.font("Helvetica-Bold").fontSize(64).fillColor(BLACK);
      doc.text(String(overall), ML, doc.y, { width: CONTENT_W });
      doc.font("Helvetica").fontSize(11).fillColor(GRAY);
      doc.text(`out of 100  —  ${tier}`, ML, doc.y, { width: CONTENT_W });

      // Bottom of cover
      doc.y = PAGE_H - 130;
      doc.save();
      doc.moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(0.5).stroke(RULE);
      doc.restore();
      doc.y += 12;
      doc.font("Helvetica").fontSize(8).fillColor(LIGHT);
      doc.text(
        "This report evaluates how well a website is positioned for citation and recommendation by AI systems such as ChatGPT, Perplexity, Claude, and Gemini. It is a diagnostic snapshot, not an exhaustive SEO audit.",
        ML, doc.y, { width: CONTENT_W, lineGap: 2 }
      );

      // ═══════════════════════════════════════════════════
      // PAGE 2 — EXECUTIVE SUMMARY & SCORE BREAKDOWN
      // ═══════════════════════════════════════════════════
      addPage();

      h1("Executive Summary");

      body(
        `${domain} received an overall AI-readiness score of ${overall}/100, placing it in the "${tier}" tier. ` +
        `This means the site has sufficient entity signals and structured data for AI systems to identify and occasionally cite it, ` +
        `but there are concrete improvements that would increase citation frequency and accuracy.`
      );
      space(4);
      body(
        `The analysis identified ${hesitations.length} key issue${hesitations.length !== 1 ? "s" : ""} that cause AI systems to hesitate before recommending this site, ` +
        `along with ${fixPlan.length} prioritised actions for the first week. ` +
        `${queries.length} simulated AI queries were run to estimate current citation likelihood.`
      );

      space(16);
      h1("Score Breakdown");

      body(
        "Each dimension reflects how AI systems weigh source quality when deciding which sites to cite. " +
        "Entity Clarity and Direct Answers carry the most weight (30% each), followed by Trust Signals (20%), " +
        "Competitive Positioning (10%), and Technical Accessibility (10%)."
      );
      space(10);

      // Score table
      const dims = [
        { label: "Entity Clarity", key: "entity_clarity",
          desc: "How clearly the site communicates who, what, and where." },
        { label: "Direct Answers", key: "direct_answers",
          desc: "Whether content provides concise, extractable answers AI can cite." },
        { label: "Trust Signals", key: "trust_signals",
          desc: "Verifiable trust markers: credentials, policies, reviews, contact info." },
        { label: "Competitive Positioning", key: "competitive_positioning",
          desc: "How well the site differentiates with concrete evidence." },
        { label: "Technical Accessibility", key: "technical_accessibility",
          desc: "Structured data, clean HTML, machine-readability." },
      ];

      for (const dim of dims) {
        const val: number = ss[dim.key] ?? 0;
        if (doc.y + 48 > PAGE_H - 80) addPage();

        const rowY = doc.y;

        // Label + score on same line
        doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
        doc.text(dim.label, ML, rowY, { lineBreak: false });
        const scoreStr = `${val}/100  (${scoreLabel(val)})`;
        doc.font("Helvetica-Bold").fontSize(10).fillColor(BLACK);
        doc.text(scoreStr, ML + CONTENT_W - doc.widthOfString(scoreStr), rowY, {
          lineBreak: false,
        });

        // Progress bar
        const barY = rowY + 16;
        doc.save();
        doc.rect(ML, barY, CONTENT_W, 6).fill(BG);
        const filled = Math.max(0, Math.min(CONTENT_W * (val / 100), CONTENT_W));
        if (filled > 0) doc.rect(ML, barY, filled, 6).fill(BLACK);
        doc.restore();

        // Description
        doc.font("Helvetica").fontSize(8).fillColor(GRAY);
        doc.text(dim.desc, ML, barY + 10, { width: CONTENT_W });

        doc.y = barY + 10 + doc.heightOfString(dim.desc, { width: CONTENT_W }) + 10;
      }

      // ═══════════════════════════════════════════════════
      // PAGE 3 — KEY ISSUES
      // ═══════════════════════════════════════════════════
      addPage();

      h1("Key Issues — Why AI Hesitates");

      body(
        "The following issues were identified as the primary reasons an AI system would hesitate " +
        "before citing this site in a user-facing answer. Each includes supporting evidence."
      );
      space(8);

      for (let i = 0; i < hesitations.length; i++) {
        const h = hesitations[i];

        if (doc.y + 60 > PAGE_H - 80) addPage();

        h2(`Issue ${i + 1}: ${h.issue || ""}`);
        space(4);

        // Why AI hesitates — in a gray box
        grayBox(h.why_ai_hesitates || "");

        // Evidence
        if (h.evidence && h.evidence.length > 0) {
          h3("Evidence");
          for (const ev of h.evidence) {
            if (doc.y + 14 > PAGE_H - 80) addPage();
            small(`\u2014  ${ev}`, 10);
          }
          space(2);
        }

        // Affected URLs
        if (h.affected_urls && h.affected_urls.length > 0) {
          doc.font("Helvetica").fontSize(7.5).fillColor(LIGHT);
          doc.text(`Affected: ${h.affected_urls.join(", ")}`, ML + 10, doc.y, {
            width: CONTENT_W - 10,
          });
          doc.y += 4;
        }

        space(12);
        if (i < hesitations.length - 1) {
          hr(0.25, RULE);
        }
      }

      // ═══════════════════════════════════════════════════
      // WEEK-1 ACTION PLAN
      // ═══════════════════════════════════════════════════
      if (doc.y + 100 > PAGE_H - 80) addPage();

      hr(1.5, BLACK);
      h1("Week-1 Action Plan");

      body(
        "Prioritised action items to implement this week for the greatest improvement in AI citation readiness."
      );
      space(6);

      for (let i = 0; i < fixPlan.length; i++) {
        numberedItem(i + 1, fixPlan[i]);
      }

      // ═══════════════════════════════════════════════════
      // AI QUERY SIMULATIONS
      // ═══════════════════════════════════════════════════
      space(10);
      if (queries.length > 0) {
        if (doc.y + 80 > PAGE_H - 80) addPage();

        hr(1.5, BLACK);
        h1("AI Query Simulations");

        body(
          "Simulated queries were run to estimate whether this site would be cited by an AI assistant. " +
          "Results indicate citation likelihood and estimated ranking position."
        );
        space(8);

        // Table header
        const colQ = 240;
        const colC = 50;
        const colP = 50;
        const colS = CONTENT_W - colQ - colC - colP;

        const tblY = doc.y;
        doc.save();
        doc.rect(ML, tblY, CONTENT_W, 16).fill(BLACK);
        doc.restore();
        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(WHITE);
        doc.text("QUERY", ML + 6, tblY + 4, { lineBreak: false });
        doc.text("CITED", ML + colQ + 6, tblY + 4, { lineBreak: false });
        doc.text("POS.", ML + colQ + colC + 6, tblY + 4, { lineBreak: false });
        doc.text("AI RESPONSE SNIPPET", ML + colQ + colC + colP + 6, tblY + 4, { lineBreak: false });
        doc.y = tblY + 20;

        for (let qi = 0; qi < queries.length; qi++) {
          const q = queries[qi];
          if (doc.y + 30 > PAGE_H - 80) addPage();

          const rowY = doc.y;

          // Alternate row shading
          if (qi % 2 === 0) {
            doc.save();
            doc.rect(ML, rowY - 2, CONTENT_W, 0).fill(BG); // placeholder
            doc.restore();
          }

          // Query text
          doc.font("Helvetica").fontSize(8).fillColor(DARK);
          doc.text(q.query || "", ML + 6, rowY, { width: colQ - 12 });
          const queryBottom = doc.y;

          // Cited
          doc.font("Helvetica-Bold").fontSize(8).fillColor(q.mentioned ? BLACK : LIGHT);
          doc.text(q.mentioned ? "Yes" : "No", ML + colQ + 6, rowY, { lineBreak: false });

          // Position
          doc.font("Helvetica").fontSize(8).fillColor(DARK);
          doc.text(q.position ? `#${q.position}` : "\u2014", ML + colQ + colC + 6, rowY, {
            lineBreak: false,
          });

          // Snippet (truncated)
          if (q.snippet) {
            const snip = q.snippet.length > 120 ? q.snippet.substring(0, 120) + "\u2026" : q.snippet;
            doc.font("Helvetica").fontSize(7).fillColor(GRAY);
            doc.text(snip, ML + colQ + colC + colP + 6, rowY, {
              width: colS - 12,
            });
          }

          doc.y = Math.max(queryBottom, doc.y) + 4;

          // Row separator
          doc.save();
          doc.moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(0.25).stroke(RULE);
          doc.restore();
          doc.y += 4;
        }
      }

      // ═══════════════════════════════════════════════════
      // COMPETITOR LANDSCAPE
      // ═══════════════════════════════════════════════════
      if (realCompetitors.length > 0) {
        space(10);
        if (doc.y + 80 > PAGE_H - 80) addPage();

        hr(1.5, BLACK);
        h1("Competitor Landscape");

        body(
          "The following competitors were identified in your niche. " +
          "Their estimated AI readiness scores reflect how well-positioned they are for citation by AI systems."
        );
        space(8);

        for (let ci = 0; ci < realCompetitors.length; ci++) {
          const comp = realCompetitors[ci];
          if (doc.y + 50 > PAGE_H - 80) addPage();

          const compY = doc.y;

          // Name + URL
          doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK);
          doc.text(comp.name || "Unknown", ML, compY, { lineBreak: false });

          if (comp.url) {
            doc.font("Helvetica").fontSize(7.5).fillColor(LIGHT);
            doc.text(`  ${comp.url}`, ML + doc.widthOfString(comp.name || "Unknown") + 4, compY + 1.5, {
              lineBreak: false,
            });
          }

          // AI readiness score bar
          const readiness: number = comp.ai_readiness_estimate ?? 0;
          const barY = compY + 16;
          const scoreText = `${readiness}/100`;

          doc.font("Helvetica").fontSize(8).fillColor(GRAY);
          doc.text("AI Readiness", ML, barY + 1, { lineBreak: false });

          const barX = ML + 70;
          const barW = CONTENT_W - 70 - 50;
          doc.save();
          doc.rect(barX, barY, barW, 6).fill(BG);
          const compFilled = Math.max(0, Math.min(barW * (readiness / 100), barW));
          if (compFilled > 0) doc.rect(barX, barY, compFilled, 6).fill(BLACK);
          doc.restore();

          doc.font("Helvetica-Bold").fontSize(8).fillColor(DARK);
          doc.text(scoreText, barX + barW + 8, barY - 1, { lineBreak: false });

          // Strengths
          if (comp.strengths && comp.strengths.length > 0) {
            doc.y = barY + 12;
            doc.font("Helvetica").fontSize(7.5).fillColor(GRAY);
            doc.text(`Strengths: ${comp.strengths.join(", ")}`, ML + 10, doc.y, {
              width: CONTENT_W - 10,
            });
            doc.y += 6;
          } else {
            doc.y = barY + 14;
          }

          if (ci < realCompetitors.length - 1) {
            doc.save();
            doc.moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(0.25).stroke(RULE);
            doc.restore();
            doc.y += 6;
          }
        }
      }

      // ═══════════════════════════════════════════════════
      // READY-TO-USE CONTENT BLOCKS
      // ═══════════════════════════════════════════════════
      if (copyBlocks.length > 0) {
        space(10);
        if (doc.y + 80 > PAGE_H - 80) addPage();

        hr(1.5, BLACK);
        h1("Ready-to-Use Content");

        body(
          "AI-optimized content blocks you can paste directly into your site to improve citation readiness. " +
          "Each includes the current text (if found) and a suggested replacement."
        );
        space(8);

        const TYPE_MAP: Record<string, string> = {
          meta_description: "Meta Description",
          faq_section: "FAQ Section",
          about_paragraph: "About / Entity Block",
          page_title: "Page Title",
        };

        for (let bi = 0; bi < copyBlocks.length; bi++) {
          const blk = copyBlocks[bi];
          if (doc.y + 60 > PAGE_H - 80) addPage();

          const typeLabel = TYPE_MAP[blk.type] || blk.type;

          // Type badge + page URL
          h3(typeLabel);
          if (blk.page_url) {
            small(blk.page_url, 0);
          }
          space(4);

          // Current value (if present)
          if (blk.current) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(LIGHT);
            doc.text("CURRENT", ML, doc.y, { width: CONTENT_W });
            doc.y += 2;
            doc.font("Helvetica").fontSize(8.5).fillColor(GRAY);
            doc.text(blk.current, ML + 10, doc.y, { width: CONTENT_W - 10, lineGap: 2 });
            doc.y += 6;
          }

          // Suggested value
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor(BLACK);
          doc.text(blk.current ? "REPLACE WITH" : "ADD THIS", ML, doc.y, { width: CONTENT_W });
          doc.y += 2;

          // Gray box for suggested text
          grayBox(blk.suggested || "");

          // FAQ questions if applicable
          if (blk.questions && blk.questions.length > 0) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(LIGHT);
            doc.text("FAQ ITEMS", ML, doc.y, { width: CONTENT_W });
            doc.y += 4;
            for (const qa of blk.questions) {
              if (doc.y + 24 > PAGE_H - 80) addPage();
              doc.font("Helvetica-Bold").fontSize(8).fillColor(DARK);
              doc.text(`Q: ${qa.q}`, ML + 10, doc.y, { width: CONTENT_W - 10 });
              doc.y += 2;
              doc.font("Helvetica").fontSize(8).fillColor(GRAY);
              doc.text(`A: ${qa.a}`, ML + 18, doc.y, { width: CONTENT_W - 18, lineGap: 2 });
              doc.y += 4;
            }
            space(2);
          }

          // Why this matters
          if (blk.why) {
            doc.font("Helvetica").fontSize(7.5).fillColor(LIGHT);
            doc.text(`Why: ${blk.why}`, ML + 10, doc.y, { width: CONTENT_W - 10, lineGap: 1.5 });
            doc.y += 4;
          }

          if (bi < copyBlocks.length - 1) {
            space(6);
            hr(0.25, RULE);
          }
        }
      }

      // ═══════════════════════════════════════════════════
      // STRUCTURED DATA & TECHNICAL FINDINGS
      // ═══════════════════════════════════════════════════
      space(10);
      if (doc.y + 60 > PAGE_H - 80) addPage();

      hr(1.5, BLACK);
      h1("Structured Data Analysis");

      if (jsonLd.length > 0) {
        // Collect all @types
        const allTypes = new Set<string>();
        for (const item of jsonLd) {
          if (typeof item === "object" && item) {
            const graph = item["@graph"] || [item];
            for (const g of graph) {
              if (typeof g === "object" && g && g["@type"]) {
                const t = g["@type"];
                if (Array.isArray(t)) t.forEach((x: string) => allTypes.add(x));
                else allTypes.add(t);
              }
            }
          }
        }

        body(
          `${jsonLd.length} JSON-LD block${jsonLd.length !== 1 ? "s" : ""} detected on the site. ` +
          `Schema types found: ${allTypes.size > 0 ? Array.from(allTypes).sort().join(", ") : "none identified"}.`
        );
        space(4);

        // Show preview of first JSON-LD
        h3("JSON-LD Preview");
        const ldStr = JSON.stringify(jsonLd[0], null, 2);
        const preview = ldStr.length > 600 ? ldStr.substring(0, 600) + "\n  ..." : ldStr;
        if (doc.y + 60 > PAGE_H - 80) addPage();
        mono(preview, 4);
      } else {
        grayBox(
          "No JSON-LD structured data detected. Adding Organization, WebSite, and FAQPage schemas " +
          "is one of the highest-impact changes for AI citation."
        );
      }

      // FAQ section
      space(8);
      h2("FAQ / Direct-Answer Content");
      if (faqs.length > 0) {
        body(
          `${faqs.length} FAQ or direct-answer block${faqs.length !== 1 ? "s" : ""} detected. ` +
          "These are valuable for AI citation as they provide concise, extractable answers."
        );
        for (const faq of faqs) {
          const fs = String(faq);
          bullet(fs.length > 200 ? fs.substring(0, 200) + "\u2026" : fs);
        }
      } else {
        // Check if FAQPage schema exists in JSON-LD
        let hasFaqSchema = false;
        for (const item of jsonLd) {
          if (typeof item === "object" && item) {
            if (item["@type"] === "FAQPage") hasFaqSchema = true;
            const graph = item["@graph"] || [];
            for (const g of graph) {
              if (typeof g === "object" && g && g["@type"] === "FAQPage") hasFaqSchema = true;
            }
          }
        }

        if (hasFaqSchema) {
          body(
            "No FAQ blocks were extracted from the page content, but FAQPage schema markup was detected in the JSON-LD. " +
            "This is a positive signal — ensure the on-page FAQ content matches the schema for consistency."
          );
        } else {
          grayBox(
            "No FAQ or direct-answer blocks detected. Adding an FAQ section with FAQPage schema markup " +
            "dramatically increases the probability of AI citation."
          );
        }
      }

      // ═══════════════════════════════════════════════════
      // LIMITATIONS & CLOSING
      // ═══════════════════════════════════════════════════
      space(12);
      if (limitations.length > 0) {
        hr();
        h3("Limitations & Caveats");
        for (const lim of limitations) {
          bullet(lim);
        }
      }

      space(12);
      hr(1, BLACK);
      space(6);
      doc.font("Helvetica").fontSize(8.5).fillColor(GRAY);
      doc.text(
        "This report was generated by GEO Analyzer (geo-analyzer.com). " +
        "For questions or support, contact hello@maxpetrusenko.com.",
        ML, doc.y, { width: CONTENT_W, align: "center" }
      );
      space(4);
      doc.font("Helvetica").fontSize(7.5).fillColor(LIGHT);
      doc.text(
        `\u00A9 ${new Date().getFullYear()} GEO Analyzer. All rights reserved.`,
        ML, doc.y, { width: CONTENT_W, align: "center" }
      );

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
