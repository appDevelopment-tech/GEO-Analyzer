"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCard from "@/components/ScoreCard";
import TextType from "@/components/TextType";
import { Footer } from "@/components/Footer";
import RotatingText from "@/components/RotatingText";

interface AnalysisResult {
  overall_score: number;
  tier: string;
  section_scores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    competitive_positioning: number;
    technical_accessibility: number;
  };
  top_hesitation: {
    issue: string;
    why_ai_hesitates: string;
    evidence: string[];
  } | null;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.report);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-6 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-apple-light">GEO Analyzer</h1>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-center mb-12"
              >
                <TextType
                  text={["Rank #1 in", "AI Search Results"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter="_"
                  deletingSpeed={50}
                  variableSpeed={{ min: 60, max: 120 }}
                  cursorBlinkDuration={0.5}
                  className="text-5xl md:text-6xl font-bold text-light-grey mb-6 leading-tight bg-gradient-to-r from-apple-blue to-cyan-500 bg-clip-text text-transparent"
                />
                <div className="flex flex-col md:flex-row items-center justify-center mb-4 gap-1">
                  <p className="text-xl text-light-grey leading-relaxed">
                    Get an evidence-based diagnostic report on your website's
                  </p>
                  <RotatingText
                    texts={[
                      "AI readiness",
                      "AI visibility",
                      "discoverability",
                      "GEO score",
                    ]}
                    mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg min-w-[9.5rem]" // adjust as needed
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                onSubmit={handleAnalyze}
                className="bg-white rounded-3xl p-8 md:p-10 relative animated-glow"
              >
                <div className="space-y-6">
                  {/* URL Input */}
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-semibold text-apple-gray mb-2"
                    >
                      Page URL
                    </label>
                    <input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      required
                      disabled={isAnalyzing}
                      className="w-full px-5 py-4 rounded-xl border-2 border-apple-border focus:border-apple-blue focus:outline-none transition-colors text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-apple-gray mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isAnalyzing}
                      className="w-full px-5 py-4 rounded-xl border-2 border-apple-border focus:border-apple-blue focus:outline-none transition-colors text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      See your AI readiness score instantly. The full breakdown
                      (with fix priorities) hits your inbox shortly.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-200"
                    >
                      <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-apple-blue to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Checking how LLMs see your content...
                      </span>
                    ) : (
                      "Check My AI Visibility"
                    )}
                  </button>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                  Created by{" "}
                  <a
                    href="https://www.maxpetrusenko.com/"
                    className="text-apple-blue"
                  >
                    @max_petrusenko
                  </a>{" "}
                  <br />. Contact me for a custom AI visibility audit.
                </p>
              </motion.form>

              {/* Features */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-16 grid md:grid-cols-3 gap-8 color-light-grey"
              >
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "No Guesswork",
                    description:
                      "Every score links back to real content on your site. See exactly what AI sees.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ),
                    title: "AI-Powered",
                    description:
                      "We use the same tech that powers ChatGPT (and more) to analyze how discoverable you really are.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    ),
                    title: "Fix It This Week",
                    description:
                      "Walk away with a prioritized action plan — not a 47-page PDF you'll never read.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-apple-blue/10 text-light-grey mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-light-grey mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
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
                  className="text-4xl md:text-5xl font-bold text-apple-gray mb-4"
                >
                  Your GEO Analysis
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg text-gray-600"
                >
                  Here's how AI sees your website
                </motion.p>
              </div>

              <ScoreCard
                score={result.overall_score}
                tier={result.tier}
                sectionScores={result.section_scores}
              />

              {/* Top Hesitation */}
              {result.top_hesitation && (
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
                      {result.top_hesitation.issue}
                    </h4>
                    <p className="text-gray-700 mb-4">
                      {result.top_hesitation.why_ai_hesitates}
                    </p>
                    {result.top_hesitation.evidence.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Evidence:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.top_hesitation.evidence.map((e, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>{e}</span>
                            </li>
                          ))}
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
                transition={{ delay: 2.5, duration: 0.5 }}
                className="text-center mt-12"
              >
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                    setEmail("");
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
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
