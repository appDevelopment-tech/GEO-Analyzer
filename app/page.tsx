"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCard from "@/components/ScoreCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Form } from "@/components/Form";
import { Features } from "@/components/Features";
import { loadStripe } from "@stripe/stripe-js";

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

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );

  async function handleStripeCheckout(email: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

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
      <Header />
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
              <Hero />
              <Form
                url={url}
                setUrl={setUrl}
                email={email}
                setEmail={setEmail}
                isAnalyzing={isAnalyzing}
                error={error}
                handleAnalyze={handleAnalyze}
              />

              {/* Features */}
              <Features />
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
                <button
                  type="button"
                  onClick={() => handleStripeCheckout(email)}
                  className="bg-apple-blue text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Pay $4.99 for Full Report
                </button>
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
