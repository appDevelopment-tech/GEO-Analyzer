"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  email: string;
  tier: string;
  sectionScores: {
    entity_clarity: number;
    direct_answers: number;
    trust_signals: number;
    competitive_positioning: number;
    technical_accessibility: number;
  };
  onCheckout?: () => void;
  paymentStatus?: "free" | "paid";
}

export default function ScoreCard({
  score,
  tier,
  sectionScores,
  email,
  onCheckout,
  paymentStatus = "free",
}: ScoreCardProps) {
  const { id } = useParams();
  const [displayScore, setDisplayScore] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  async function handleStripeCheckout(id: string, email: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });
    const { url } = await res.json();
    window.open(url, "_blank");
  }

  const isPaid = paymentStatus === "paid";

  useEffect(() => {
    // Animate score count-up
    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = score / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-blue-500 to-cyan-600";
    if (score >= 40) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const sections = [
    { key: "entity_clarity", label: "Entity Clarity", weight: "30%" },
    { key: "direct_answers", label: "Direct Answers", weight: "30%" },
    { key: "trust_signals", label: "Trust Signals", weight: "20%" },
    {
      key: "competitive_positioning",
      label: "Competitive Positioning",
      weight: "10%",
    },
    {
      key: "technical_accessibility",
      label: "Technical Accessibility",
      weight: "10%",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Overall Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreColor(score)} p-12 text-white shadow-2xl mb-12`}
      >
        <div className="relative z-10 text-center">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-3"
          >
            Overall GEO/AEO Score
          </motion.p>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="text-8xl font-bold mb-4"
          >
            {displayScore}
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl font-semibold"
          >
            {tier}
          </motion.p>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
      </motion.div>

      {/* Share button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="m-6 relative flex justify-center"
      >
        <button
          onClick={() => setShareOpen(!shareOpen)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share Your Score
        </button>
        {shareOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-3 min-w-[220px] z-20">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                } catch {
                  const ta = document.createElement("textarea");
                  ta.value = window.location.href;
                  ta.style.position = "fixed";
                  ta.style.opacity = "0";
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand("copy");
                  document.body.removeChild(ta);
                }
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              {linkCopied ? "Copied!" : "Copy link"}
            </button>
            <button
              onClick={() => {
                const text = `I scored ${score}/100 on AI visibility (${tier}). Check how your site ranks against AI: ${window.location.href}`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                  "_blank",
                );
                setShareOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                  "_blank",
                );
                setShareOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </button>
          </div>
        )}
      </motion.div>

      {/* Section Scores */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
      >
        <h2 className="text-2xl font-bold text-apple-gray mb-8">
          Detailed Breakdown
        </h2>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const sectionScore =
              sectionScores[section.key as keyof typeof sectionScores];

            return (
              <motion.div
                key={section.key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-between items-baseline mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-semibold text-apple-gray">
                      {section.label}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      {section.weight}
                    </span>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
                    className="text-lg font-bold text-apple-blue"
                  >
                    {sectionScore}
                  </motion.span>
                </div>

                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sectionScore}%` }}
                    transition={{
                      delay: 1.2 + index * 0.1,
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(sectionScore)}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        {isPaid && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-green-600">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-semibold">
                Full report — check your email for the PDF
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
