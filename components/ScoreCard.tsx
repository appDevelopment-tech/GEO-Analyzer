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
}

export default function ScoreCard({
  score,
  tier,
  sectionScores,
  email,
}: ScoreCardProps) {
  const { id } = useParams();
  const [displayScore, setDisplayScore] = useState(0);

  async function handleStripeCheckout(id: string, email: string) {
    console.log("Initiating checkout for report ID:", id, "and email:", email);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });
    const { url } = await res.json();
    window.open(url, "_blank");
  }

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
            Overall GEO Score
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
        <h3 className="text-2xl font-bold text-blue-900 my-4">
          Why pay for the full report?
        </h3>
        <p className="mb-4 text-blue-900 text-lg font-semibold">
          The free scan shows you the problem. The full report shows you the
          fix.
        </p>
        <p className="mb-4 text-blue-900">
          AI isn't recommending you for a reason — usually several. Your full
          report uncovers every hesitation: missing structure, weak entity
          signals, content that's invisible to LLMs. More importantly, you'll
          know exactly what to do about it.
        </p>
        <ul className="mb-4 list-disc pl-6 text-blue-900">
          <li className="mb-2">
            <b>Every AI hesitation explained</b> — not just flagged, but broken
            down in plain English
          </li>
          <li className="mb-2">
            <b>A 1-week action plan</b> — prioritized fixes you can start
            Monday, not a 6-month roadmap
          </li>
          <li className="mb-2">
            <b>The "why" behind each fix</b> — so you're not just checking
            boxes, you're understanding the game
          </li>
        </ul>
        <p className="text-blue-900 font-semibold">
          Stop guessing why AI picks your competitors. Start fixing it.
        </p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          type="button"
          onClick={() => handleStripeCheckout(id as string, email)}
          className="w-full mt-2 bg-gradient-to-r from-apple-blue to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Get a Full Report
        </motion.button>
      </motion.div>
    </div>
  );
}
