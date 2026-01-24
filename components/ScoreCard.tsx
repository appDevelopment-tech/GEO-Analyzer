"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
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
}: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

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
      </motion.div>

      {/* Email confirmation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-full">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-sm font-medium text-green-900">
            Full report sent to your email
          </p>
        </div>
      </motion.div>
    </div>
  );
}
