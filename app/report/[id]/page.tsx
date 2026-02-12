"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ScoreCard from "@/components/ScoreCard";
import AIQueryPanel from "@/components/AIQueryPanel";
import AIBlindSpotsPanel from "@/components/AIBlindSpotsPanel";
import FixRoadmapPanel from "@/components/FixRoadmapPanel";
import JsonLdBlock from "@/components/JsonLdBlock";
import CompetitorSnapshot from "@/components/CompetitorSnapshot";
import UnlockCTA from "@/components/UnlockCTA";
import CopyBlocksPanel from "@/components/CopyBlocksPanel";

const POLL_INTERVAL = 3000; // check every 3 seconds
const MAX_POLLS = 40; // give up after ~2 minutes

const ANALYSIS_STEPS = [
  "Fetching your website content...",
  "Extracting structured data & signals...",
  "Running AI citation analysis...",
  "Evaluating competitive positioning...",
  "Generating your report...",
];

export default function ReportPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workerTriggered = useRef(false);

  // Capture the URL from query params once on mount (into a ref so it
  // never causes the poll callback to be recreated).
  const analysisUrlRef = useRef<string | null>(null);
  useEffect(() => {
    analysisUrlRef.current = searchParams.get("url");
  }, [searchParams]);

  // Trigger the worker — fire-and-forget from the browser.
  // The worker runs in its own Netlify function invocation.
  const triggerWorker = useCallback((reportId: string, url: string) => {
    if (workerTriggered.current) return;
    workerTriggered.current = true;

    console.log(
      `[Report] Triggering worker for report_id=${reportId}, url=${url}`,
    );

    const workerUrl =
      window.location.hostname === "localhost"
        ? "/api/analyze-worker"
        : "/.netlify/functions/analyze-background";

    fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_id: reportId, url }),
    })
      .then(() => console.log("[Report] Background worker triggered"))
      .catch((err) => console.error("[Report] Worker trigger failed:", err));
  }, []);

  // Poll /api/report/{id} — stable callback that only depends on `id`
  // so re-renders don't kill the setTimeout chain.
  const fetchReport = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/report/${id}?_t=${Date.now()}`);
      const data = await res.json();

      console.log(
        `[Report] Poll #${pollCount.current} — status=${data.status}`,
      );

      if (data.status === "processing") {
        // On first "processing" poll, trigger the worker
        const url = analysisUrlRef.current;
        if (url && !workerTriggered.current) {
          triggerWorker(id as string, url);
        }

        pollCount.current += 1;
        setProcessing(true);
        setLoading(false);

        if (pollCount.current >= MAX_POLLS) {
          setProcessing(false);
          setError(
            "Analysis is taking longer than expected. Please refresh the page in a minute.",
          );
          return;
        }

        pollTimer.current = setTimeout(fetchReport, POLL_INTERVAL);
        return;
      }

      if (data.status === "error" || data.error) {
        setError(data.error || "Analysis failed. Please try again.");
        setProcessing(false);
        setLoading(false);
        return;
      }

      // Success — show the report
      setReport(data);
      setProcessing(false);
      setLoading(false);
    } catch {
      setError("Failed to load report.");
      setProcessing(false);
      setLoading(false);
    }
  }, [id, triggerWorker]); // ← no searchParams — stable across re-renders

  // Start polling on mount
  useEffect(() => {
    fetchReport();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [fetchReport]);

  // Animate the step text while processing
  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [processing]);

  async function handleStripeCheckout() {
    if (!id || !report?.email) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email: report.email }),
    });
    const { url } = await res.json();
    window.open(url, "_blank");
  }

  // Processing state — nice animated loader
  if (processing || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-apple-gray">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-6">
            <span
              className="absolute inset-0 rounded-full border-4 border-t-apple-blue border-b-cyan-400 border-l-transparent border-r-transparent animate-spin"
              style={{
                borderTopColor: "#2563eb",
                borderBottomColor: "#06b6d4",
              }}
            ></span>
            <span className="absolute inset-2 rounded-full bg-white opacity-80"></span>
            <span className="absolute inset-4 rounded-full bg-gradient-to-br from-apple-blue to-cyan-400 opacity-60"></span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={processing ? stepIndex : "loading"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-xl font-semibold text-apple-light drop-shadow-lg text-center"
            >
              {processing
                ? ANALYSIS_STEPS[stepIndex]
                : "Loading your GEO/AEO report..."}
            </motion.div>
          </AnimatePresence>
          {processing && (
            <p className="mt-4 text-sm text-gray-400">
              This usually takes 15–30 seconds
            </p>
          )}
        </div>
      </main>
    );
  }

  if (!id || error || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            {error || "Report not found."}
          </div>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-apple-gray hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const isLocked = report.is_locked !== false;
  const paymentStatus = report.payment_status || "free";
  const fullReport = report.full_report;

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto"></div>
      <AnimatePresence mode="sync">
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Title */}
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-light-grey mb-4"
            >
              Your GEO/AEO Analysis
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-200"
            >
              Here&apos;s how AI sees your website
            </motion.p>
            {report.domain && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-gray-400 mt-2"
              >
                {report.domain}
              </motion.p>
            )}
          </div>

          {/* 1. Score Card — always visible */}
          <ScoreCard
            score={fullReport.overall_score}
            tier={fullReport.tier}
            sectionScores={fullReport.section_scores}
            email={report.email}
            onCheckout={handleStripeCheckout}
            paymentStatus={paymentStatus}
          />

          {/* 2. How AI Sees You — first query free, rest blurred */}
          {fullReport.ai_query_simulations &&
            fullReport.ai_query_simulations.length > 0 && (
              <AIQueryPanel
                simulations={fullReport.ai_query_simulations}
                isLocked={isLocked}
                onUnlock={handleStripeCheckout}
                delay={2.4}
              />
            )}

          {/* 3. Primary AI Hesitation — always visible */}
          {fullReport.top_ai_hesitations &&
            fullReport.top_ai_hesitations.length > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.6 }}
                className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10"
              >
                <h3 className="text-2xl font-bold text-apple-gray mb-6">
                  Primary AI Hesitation
                </h3>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                  <h4 className="font-semibold text-apple-gray mb-2">
                    {fullReport.top_ai_hesitations[0].issue}
                  </h4>
                  <p className="text-gray-700 mb-4">
                    {fullReport.top_ai_hesitations[0].why_ai_hesitates}
                  </p>
                  {fullReport.top_ai_hesitations[0].evidence.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        Evidence:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {fullReport.top_ai_hesitations[0].evidence.map(
                          (e: string) => (
                            <li key={e} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">
                                &bull;
                              </span>
                              <span>{e}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          {/* 4. JSON-LD Generator — always free, copyable */}
          <JsonLdBlock
            domain={report.domain || ""}
            extractedJsonLd={fullReport.extracted_json_ld || []}
            extractedFaqs={fullReport.extracted_faqs || []}
            delay={3.2}
          />

          {/* 5. Who AI Picks Instead — names always free, scores/strengths paid */}
          {fullReport.ai_query_simulations &&
            fullReport.ai_query_simulations.length > 0 && (
              <CompetitorSnapshot
                simulations={fullReport.ai_query_simulations}
                realCompetitors={fullReport.real_competitors}
                isLocked={isLocked}
                delay={3.6}
              />
            )}

          {/* 6. Unlock CTA — for free users, placed after free value */}
          {isLocked && (
            <UnlockCTA onCheckout={handleStripeCheckout} delay={4.0} />
          )}

          {/* 7. AI Blind Spots — blurred for free */}
          {fullReport.top_ai_hesitations &&
            fullReport.top_ai_hesitations.length > 1 && (
              <AIBlindSpotsPanel
                hesitations={fullReport.top_ai_hesitations}
                isLocked={isLocked}
                onUnlock={handleStripeCheckout}
                delay={4.4}
              />
            )}

          {/* 8. Fix Roadmap — blurred for free */}
          {fullReport.week1_fix_plan &&
            fullReport.week1_fix_plan.length > 0 && (
              <FixRoadmapPanel
                fixPlan={fullReport.week1_fix_plan}
                isLocked={isLocked}
                onUnlock={handleStripeCheckout}
                delay={4.8}
              />
            )}

          {/* 9. Copy Blocks — blurred for free */}
          {fullReport.copy_blocks && fullReport.copy_blocks.length > 0 && (
            <CopyBlocksPanel
              blocks={fullReport.copy_blocks}
              isLocked={isLocked}
              onUnlock={handleStripeCheckout}
              delay={5.2}
            />
          )}

          {/* New Analysis Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 5.6, duration: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-apple-gray hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Analyze Another Site
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
