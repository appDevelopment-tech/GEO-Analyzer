import PDFDocument from 'pdfkit';
import { FullReport } from './report-types';

interface PDFOptions {
  margin?: number;
  fontSize?: {
    title: number;
    heading: number;
    subheading: number;
    body: number;
    small: number;
  };
}

export async function generateReportPDF(
  report: FullReport,
  options: PDFOptions = {}
): Promise<Buffer> {
  const doc = new PDFDocument({
    margin: options.margin || 50,
    size: 'LETTER',
    info: {
      Title: `GEO Analysis Report - ${report.domain}`,
      Author: 'GEO Analyzer',
      Subject: `AI Recommendation Readiness Report for ${report.domain}`,
      Creator: 'GEO Analyzer',
    },
  });

  const fontSize = {
    title: 28,
    heading: 20,
    subheading: 14,
    body: 11,
    small: 9,
    ...options.fontSize,
  };

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  // Colors
  const colors = {
    primary: '#0071e3',
    dark: '#1d1d1f',
    gray: '#6e6e73',
    lightGray: '#f5f5f7',
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
  };

  let pageNumber = 1;
  const totalPages = 1; // Will be updated at the end

  // Helper: Add page header
  function addHeader(doc: any) {
    if (doc.y > 700) {
      doc.addPage();
      pageNumber++;
    }

    doc.fontSize(fontSize.small)
      .fillColor(colors.gray)
      .text(`GEO Analyzer - ${report.domain}`, 50, 30, { align: 'left' })
      .text(`Page ${pageNumber}`, 50, 30, { align: 'right' });

    doc.moveTo(50, 45)
      .lineTo(545, 45)
      .strokeColor(colors.lightGray)
      .lineWidth(1)
      .stroke();

    doc.y = 65;
  }

  // === COVER PAGE ===
  doc.addPage();
  doc.fillColor(colors.primary)
    .fontSize(fontSize.title)
    .text('GEO Analyzer', { align: 'center' })
    .moveDown(0.5);

  doc.fillColor(colors.dark)
    .fontSize(18)
    .text('AI Recommendation Readiness Report', { align: 'center' })
    .moveDown(1);

  doc.fillColor(colors.gray)
    .fontSize(fontSize.subheading)
    .text(`Analysis for:`, { align: 'center' })
    .fontSize(16)
    .fillColor(colors.dark)
    .text(report.domain, { align: 'center' })
    .moveDown(1);

  // Score circle
  const scoreX = doc.page.width / 2;
  const scoreY = doc.y + 80;
  const scoreRadius = 70;

  // Score background circle
  doc.circle(scoreX, scoreY, scoreRadius)
    .fillAndStroke(getScoreFill(report.executive_summary.overall_score), colors.primary);

  // Score text
  doc.fillColor('#ffffff')
    .fontSize(48)
    .text(report.executive_summary.overall_score.toString(), scoreX - 25, scoreY - 18, {
      width: 50,
      align: 'center',
    });

  // Tier label
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.dark)
    .text(report.executive_summary.tier, { align: 'center' })
    .moveDown(2);

  // Date
  doc.fontSize(fontSize.body)
    .fillColor(colors.gray)
    .text(`Generated: ${new Date(report.analysis_date).toLocaleDateString()}`, {
      align: 'center',
    })
    .text(`Report ID: ${report.report_id}`, { align: 'center' })
    .moveDown(2);

  // Quick stats
  const statsY = doc.y;
  const colWidth = 150;
  const startX = 70;

  doc.fontSize(fontSize.small)
    .fillColor(colors.gray);

  Object.entries(report.sections).forEach(([key, section], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = startX + (col * colWidth);
    const y = statsY + (row * 40);

    doc.text(formatLabel(key), x, y, { width: colWidth })
      .fontSize(14)
      .fillColor(colors.primary)
      .text(`${section.score}/100`, x, y + 12, { width: colWidth })
      .fontSize(fontSize.small)
      .fillColor(colors.gray);
  });

  function getScoreFill(score: number): string {
    if (score < 40) return '#ff3b30';
    if (score < 60) return '#ff9500';
    if (score < 75) return '#0071e3';
    return '#34c759';
  }

  function formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // === EXECUTIVE SUMMARY ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Executive Summary');

  doc.moveDown(0.5);

  // One sentence summary
  doc.fontSize(fontSize.body)
    .fillColor(colors.gray)
    .text(report.executive_summary.one_sentence_summary, {
      align: 'justify',
    })
    .moveDown(1);

  // Primary obstacle
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.dark)
    .text('Primary Obstacle');

  doc.fontSize(fontSize.body)
    .fillColor(colors.gray)
    .text(report.executive_summary.primary_obstacle, {
      align: 'justify',
    })
    .moveDown(1);

  // Key findings
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.dark)
    .text('Key Findings')
    .moveDown(0.3);

  report.executive_summary.key_findings.forEach((finding, i) => {
    doc.fontSize(fontSize.body)
      .fillColor(colors.gray)
      .text(`${i + 1}. ${finding}`, { align: 'justify' })
      .moveDown(0.2);
  });

  doc.moveDown(0.5);

  // Quick wins
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.dark)
    .text('Quick Wins (High Impact, Low Effort)')
    .moveDown(0.3);

  report.executive_summary.quick_wins.forEach((win, i) => {
    const checkmark = '✓';
    doc.fontSize(fontSize.body)
      .fillColor(colors.success)
      .text(checkmark, 70, doc.y, { width: 15 })
      .fillColor(colors.gray)
      .text(win, 85, doc.y - (fontSize.body * 0.4), {
        align: 'justify',
        width: 460,
      })
      .moveDown(0.3);
  });

  // === SCORE BREAKDOWN ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Score Breakdown')
    .moveDown(0.5);

  Object.entries(report.sections).forEach(([key, section]) => {
    if (doc.y > 600) {
      doc.addPage();
      addHeader(doc);
    }

    // Section header with score
    doc.fontSize(fontSize.subheading)
      .fillColor(colors.dark)
      .text(`${formatLabel(key)}: ${section.score}/100`, 70, doc.y)
      .moveDown(0.2);

    // Status badge
    const statusColors: Record<string, string> = {
      critical: colors.error,
      needs_work: colors.warning,
      adequate: colors.primary,
      good: colors.success,
      excellent: '#059669',
    };

    doc.fontSize(fontSize.small)
      .fillColor(statusColors[section.status] || colors.gray)
      .text(`Status: ${section.status.toUpperCase().replace(/_/g, ' ')}`, 70, doc.y)
      .moveDown(0.3);

    // Findings
    doc.fontSize(fontSize.body)
      .fillColor(colors.gray)
      .text(section.findings.what_we_found, {
        align: 'justify',
        width: 460,
      })
      .moveDown(0.3);

    doc.fontSize(fontSize.small)
      .fillColor(colors.gray)
      .text('Why it matters:')
      .fontSize(fontSize.body)
      .text(section.findings.why_it_matters, {
        align: 'justify',
        width: 460,
      })
      .moveDown(0.3);

    // Evidence
    if (section.findings.evidence.length > 0) {
      doc.fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text('Evidence:');
      section.findings.evidence.forEach((ev) => {
        doc.fontSize(fontSize.body)
          .text(`• ${ev}`, { align: 'justify', width: 450 })
          .moveDown(0.1);
      });
    }

    doc.moveDown(0.5);

    // Recommendations for this section
    if (section.recommendations.length > 0) {
      doc.fontSize(fontSize.small)
        .fillColor(colors.primary)
        .text('RECOMMENDATIONS');

      section.recommendations.forEach((rec) => {
        const impactY = doc.y;
        doc.fontSize(fontSize.body)
          .fillColor(colors.dark)
          .text(rec.action, { align: 'justify', width: 380 })
          .fontSize(fontSize.small)
          .fillColor(colors.success)
          .text(`+${rec.expected_improvement} pts`, 455, impactY, {
            width: 50,
            align: 'right',
          });

        doc.fontSize(fontSize.small)
          .fillColor(colors.gray)
          .text(`Effort: ${getEffortLabel(rec.effort_level)} • Pages: ${rec.pages_affected.join(', ')}`)
          .moveDown(0.3);
      });
    }

    doc.moveDown(0.5);
  });

  function getEffortLabel(level: number): string {
    const labels = ['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
    return labels[level] || 'Unknown';
  }

  // === PAGE-BY-PAGE ANALYSIS ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Page-by-Page Analysis')
    .moveDown(0.5);

  for (const page of report.page_analysis) {
    if (doc.y > 550) {
      doc.addPage();
      addHeader(doc);
    }

    // Page header
    doc.fontSize(fontSize.subheading)
      .fillColor(colors.primary)
      .text(page.pageTitle || page.url, 70, doc.y)
      .moveDown(0.2);

    doc.fontSize(fontSize.small)
      .fillColor(colors.gray)
      .text(page.url)
      .moveDown(0.3);

    // Current content summary
    if (page.currentContent.length > 0) {
      doc.fontSize(fontSize.small)
        .fillColor(colors.dark)
        .text('Current State:');

      page.currentContent.slice(0, 5).forEach((content) => {
        const label = content.type.toUpperCase();
        const value = content.current.substring(0, 80) +
          (content.current.length > 80 ? '...' : '');

        doc.fontSize(fontSize.small)
          .fillColor(colors.gray)
          .text(`${label}: ${value}`);
      });
    }

    doc.moveDown(0.3);

    // Recommendations
    if (page.recommendations.length > 0) {
      // Sort by priority
      const sorted = [...page.recommendations].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      });

      sorted.slice(0, 4).forEach((rec) => {
        const priorityColor: Record<string, string> = {
          critical: colors.error,
          high: colors.warning,
          medium: colors.primary,
          low: colors.gray,
        };

        doc.fontSize(fontSize.small)
          .fillColor(priorityColor[rec.priority])
          .text(`${rec.priority.toUpperCase()}: ${rec.category.replace(/_/g, ' ')}`);

        doc.fontSize(fontSize.body)
          .fillColor(colors.dark)
          .text(rec.what_to_add, { align: 'justify', width: 460 })
          .moveDown(0.1);

        doc.fontSize(fontSize.small)
          .fillColor(colors.gray)
          .text(`Where: ${rec.where_to_add}`)
          .text(`Impact: +${rec.estimated_impact} points • Effort: ${rec.effort}`);

        // Code snippet (truncated if too long)
        const code = rec.exact_code.length > 200
          ? rec.exact_code.substring(0, 200) + '\n...'
          : rec.exact_code;

        doc.rect(70, doc.y + 3, 460, calculateCodeHeight(code))
          .fill(colors.lightGray);

        doc.fontSize(fontSize.small - 1)
          .fillColor('#333')
          .text(code, 75, doc.y + 6, {
            width: 450,
            lineGap: 2,
          });

        doc.moveDown(0.5);
      });
    }

    doc.moveDown(0.3);
  }

  function calculateCodeHeight(code: string): number {
    const lines = code.split('\n').length;
    return Math.max(30, lines * 12) + 6;
  }

  // === DIRECT ANSWER RECOMMENDATIONS ===
  if (report.direct_answer_recommendations.length > 0) {
    doc.addPage();
    addHeader(doc);

    doc.fontSize(fontSize.heading)
      .fillColor(colors.dark)
      .text('Direct Answer Recommendations')
      .moveDown(0.5);

    doc.fontSize(fontSize.body)
      .fillColor(colors.gray)
      .text(
        'Direct answers are 40-60 word factual paragraphs that AI models extract ' +
          'and quote directly. These are critical for AI citations.',
        { align: 'justify' }
      )
      .moveDown(0.5);

    for (const answer of report.direct_answer_recommendations.slice(0, 6)) {
      if (doc.y > 600) {
        doc.addPage();
        addHeader(doc);
      }

      doc.fontSize(fontSize.subheading)
        .fillColor(colors.primary)
        .text(answer.recommendation.suggested_h1)
        .moveDown(0.2);

      doc.fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text(`Page: ${answer.page_url}`)
        .text(
          `Current: ${answer.current_state.has_direct_answer ? 'Has answer (' + answer.current_state.word_count + ' words)' : 'No direct answer'}`
        )
        .text(`Suggested length: ${answer.recommendation.word_count} words`)
        .text(`Estimated impact: +${answer.estimated_impact} points`)
        .moveDown(0.3);

      doc.fontSize(fontSize.small)
        .fillColor(colors.dark)
        .text('Recommended Answer:');
      doc.rect(70, doc.y + 3, 460, 60)
        .fill(colors.lightGray);

      doc.fontSize(fontSize.body)
        .fillColor('#333')
        .text(answer.recommendation.suggested_answer, 75, doc.y + 6, {
          width: 450,
          align: 'justify',
        })
        .moveDown(1);
    }
  }

  // === SCHEMA RECOMMENDATIONS ===
  if (report.schema_recommendations.length > 0) {
    doc.addPage();
    addHeader(doc);

    doc.fontSize(fontSize.heading)
      .fillColor(colors.dark)
      .text('JSON-LD Schema Recommendations')
      .moveDown(0.5);

    for (const schema of report.schema_recommendations) {
      if (doc.y > 550) {
        doc.addPage();
        addHeader(doc);
      }

      const priorityColor: Record<string, string> = {
        critical: colors.error,
        high: colors.warning,
        medium: colors.primary,
      };

      doc.fontSize(fontSize.subheading)
        .fillColor(colors.primary)
        .text(`${schema.schema_type} Schema`)
        .moveDown(0.2);

      doc.fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text(
          `Current: ${schema.current_state.exists ? 'Exists' : 'Not found'} ${
            schema.current_state.missing_fields?.length
              ? '(Missing: ' + schema.current_state.missing_fields.join(', ') + ')'
              : ''
          }`
        )
        .fillColor(priorityColor[schema.recommendation.priority])
        .text(`Priority: ${schema.recommendation.priority.toUpperCase()}`)
        .text(`Where to add: ${schema.recommendation.where_to_place}`)
        .text(`Estimated impact: +${schema.estimated_impact} points`)
        .moveDown(0.3);

      // Schema code
      const code = schema.recommendation.exact_json_ld;
      const lines = code.split('\n').length;
      const height = Math.min(300, Math.max(60, lines * 10));

      doc.rect(70, doc.y + 3, 460, height)
        .fill('#f8f9fa')
        .stroke(colors.gray);

      doc.fontSize(fontSize.small - 1)
        .fillColor('#333')
        .text(code, 75, doc.y + 6, {
          width: 450,
          lineGap: 1,
        });

      doc.moveDown(0.5);
    }
  }

  // === IMPLEMENTATION ROADMAP ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Implementation Roadmap')
    .moveDown(0.5);

  // Week 1
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.error)
    .text('Week 1 - Critical & High Priority')
    .moveDown(0.3);

  if (report.implementation_roadmap.week_1.tasks.length > 0) {
    report.implementation_roadmap.week_1.tasks.forEach((task) => {
      doc.fontSize(fontSize.body)
        .fillColor(colors.dark)
        .text(`• ${task.task}`, { align: 'justify', width: 400 })
        .fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text(`Pages: ${task.pages.join(', ')} • Effort: ${task.effort} • +${task.impact} pts`, 90)
        .moveDown(0.2);
    });
  } else {
    doc.fontSize(fontSize.body)
      .fillColor(colors.gray)
      .text(report.implementation_roadmap.week_1.tasks.map(t => t.task).join('\n• '))
      .moveDown(0.3);
  }

  doc.moveDown(0.3);

  // Weeks 2-4
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.warning)
    .text('Weeks 2-4 - High & Medium Priority')
    .moveDown(0.3);

  if (report.implementation_roadmap.week_2_4.tasks.length > 0) {
    report.implementation_roadmap.week_2_4.tasks.forEach((task) => {
      doc.fontSize(fontSize.body)
        .fillColor(colors.dark)
        .text(`• ${task.task}`, { align: 'justify', width: 400 })
        .fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text(`Pages: ${task.pages.join(', ')} • Effort: ${task.effort} • +${task.impact} pts`, 90)
        .moveDown(0.2);
    });
  }

  doc.moveDown(0.3);

  // Ongoing
  doc.fontSize(fontSize.subheading)
    .fillColor(colors.primary)
    .text('Ongoing - Maintenance & Optimization')
    .moveDown(0.3);

  if (report.implementation_roadmap.ongoing.tasks.length > 0) {
    report.implementation_roadmap.ongoing.tasks.forEach((task) => {
      doc.fontSize(fontSize.body)
        .fillColor(colors.dark)
        .text(`• ${task.task}`)
        .fontSize(fontSize.small)
        .fillColor(colors.gray)
        .text(`Frequency: ${task.frequency} • +${task.impact} pts`, 90)
        .moveDown(0.2);
    });
  }

  // === SCORE PROJECTION ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Score Projection')
    .moveDown(0.5);

  const projection = report.score_projection;
  const milestones = [
    { label: 'Current', score: projection.current_score, y: doc.y + 30 },
    { label: 'After Week 1', score: projection.after_week_1, y: doc.y + 100 },
    { label: 'After Week 4', score: projection.after_week_4, y: doc.y + 170 },
    { label: 'After 3 Months', score: projection.after_3_months, y: doc.y + 240 },
    { label: 'Target', score: projection.target_score, y: doc.y + 310 },
  ];

  // Draw projection chart
  const chartLeft = 100;
  const chartWidth = 400;
  const chartBottom = doc.y + 330;
  const maxScore = 100;

  milestones.forEach((milestone, index) => {
    const barHeight = (milestone.score / maxScore) * (chartBottom - doc.y);
    const barColor = getScoreFill(milestone.score);

    // Bar
    doc.rect(chartLeft + (index * 80), chartBottom - barHeight, 50, barHeight)
      .fill(barColor);

    // Label
    doc.fontSize(fontSize.small)
      .fillColor(colors.dark)
      .text(milestone.label, chartLeft + (index * 80), chartBottom + 5, {
        width: 50,
        align: 'center',
      });

    // Score
    doc.fontSize(fontSize.body)
      .fillColor(barColor)
      .text(milestone.score.toString(), chartLeft + (index * 80), chartBottom - barHeight - 15, {
        width: 50,
        align: 'center',
      });
  });

  doc.y = chartBottom + 50;

  doc.fontSize(fontSize.body)
    .fillColor(colors.gray)
    .text(
      `Based on implementing ${report.implementation_roadmap.week_1.tasks.length} critical fixes in Week 1, ` +
        `followed by ${report.implementation_roadmap.week_2_4.tasks.length} additional improvements over the next 3 weeks.`,
      { align: 'justify' }
    );

  // === TECHNICAL APPENDIX ===
  doc.addPage();
  addHeader(doc);

  doc.fontSize(fontSize.heading)
    .fillColor(colors.dark)
    .text('Technical Appendix')
    .moveDown(0.5);

  doc.fontSize(fontSize.body)
    .fillColor(colors.dark)
    .text('Analysis Summary')
    .moveDown(0.3);

  const appendix = [
    ['Pages Crawled', report.technical_appendix.pages_crawled.toString()],
    ['Total Words Analyzed', report.technical_appendix.total_words_analyzed.toString()],
    ['JSON-LD Schemas Found', report.technical_appendix.json_ld_found.toString()],
    ['FAQ Sections Found', report.technical_appendix.faqs_found.toString()],
    ['Entity Mentions Found', report.technical_appendix.entity_mentions_found.toString()],
  ];

  appendix.forEach(([label, value]) => {
    doc.fontSize(fontSize.body)
      .fillColor(colors.dark)
      .text(label, 70, doc.y, { width: 200 })
      .fillColor(colors.primary)
      .text(value, 280, doc.y, { width: 100 })
      .moveDown(0.2);
  });

  doc.moveDown(0.5);

  // Limitations
  if (report.technical_appendix.limitations.length > 0) {
    doc.fontSize(fontSize.subheading)
      .fillColor(colors.dark)
      .text('Limitations')
      .moveDown(0.3);

    report.technical_appendix.limitations.forEach((limit) => {
      doc.fontSize(fontSize.body)
        .fillColor(colors.gray)
        .text(`• ${limit}`, { align: 'justify' })
        .moveDown(0.2);
    });
  }

  // Footer on last page
  doc.addPage();
  doc.fontSize(fontSize.body)
    .fillColor(colors.gray)
    .text(
      'This report was generated by GEO Analyzer. It is a diagnostic tool based on publicly available ' +
        'information and current best practices for Generative Engine Optimization (GEO).',
      { align: 'center' }
    )
    .moveDown(0.5);

  doc.fontSize(fontSize.small)
    .fillColor(colors.gray)
    .text(
      'For questions about this report, please reply to the email you received it from.',
      { align: 'center' }
    )
    .moveDown(1);

  doc.fontSize(fontSize.small)
    .fillColor(colors.gray)
    .text(
      `© ${new Date().getFullYear()} GEO Analyzer. All rights reserved.`,
      { align: 'center' }
    );

  // Finalize
  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
