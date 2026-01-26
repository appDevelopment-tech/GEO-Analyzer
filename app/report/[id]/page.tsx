"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ScoreCard from "@/components/ScoreCard";

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/report/${id}`)
      .then((res) => res.json())
      .then((data: any) => {
        if (data.error) {
          setError(data.error);
        } else {
          setReport(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load report.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading report...</div>
      </main>
    );
  }

  if (!id || error || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error || "Report not found."}
        </div>
      </main>
    );
  }

  console.log("Report data:", report);

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Results Section */}
          <div className="mb-12 text-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-light-grey mb-4"
            >
              Your GEO Analysis
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-200"
            >
              Here's how AI sees your website
            </motion.p>
          </div>

          <ScoreCard
            score={report.full_report.overall_score}
            tier={report.full_report.tier}
            sectionScores={report.full_report.section_scores}
            email={report.email}
          />

          {/* Top Hesitation */}
          {report.full_report.top_ai_hesitations && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="max-w-3xl mx-auto mt-12 bg-white rounded-3xl shadow-xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold text-apple-gray mb-6">
                Primary AI Hesitation
              </h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                <h4 className="font-semibold text-apple-gray mb-2">
                  {report.full_report.top_ai_hesitations[0].issue}
                </h4>
                <p className="text-gray-700 mb-4">
                  {report.full_report.top_ai_hesitations[0].why_ai_hesitates}
                </p>
                {report.full_report.top_ai_hesitations[0].evidence.length >
                  0 && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Evidence:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {report.full_report.top_ai_hesitations[0].evidence.map(
                        (e: string) => (
                          <li key={e} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
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

          {/* New Analysis Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.5 }}
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
