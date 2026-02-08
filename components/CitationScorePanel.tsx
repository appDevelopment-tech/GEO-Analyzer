"use client";

import { motion } from "framer-motion";

interface CitationScorePanelProps {
  score: number;
  delay?: number;
}

export default function CitationScorePanel({
  score,
  delay = 2.0,
}: CitationScorePanelProps) {
  const getColor = (s: number) => {
    if (s >= 60) return { bg: "from-green-500 to-emerald-600", text: "text-green-600", label: "Strong" };
    if (s >= 35) return { bg: "from-yellow-500 to-orange-500", text: "text-orange-600", label: "Moderate" };
    return { bg: "from-red-500 to-rose-600", text: "text-red-600", label: "Weak" };
  };

  const color = getColor(score);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <svg
          className="w-7 h-7 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-2xl font-bold text-apple-gray">
          AI Citation Probability
        </h3>
      </div>

      <div className="flex items-center gap-8">
        {/* Big number */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.5, type: "spring" }}
            className={`text-6xl font-bold bg-gradient-to-r ${color.bg} bg-clip-text text-transparent`}
          >
            {score}%
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }}
            className={`text-sm font-semibold ${color.text}`}
          >
            {color.label}
          </motion.span>
        </div>

        {/* Explanation */}
        <div className="flex-1">
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Based on your entity clarity, content structure, trust signals, and
            technical markup, there&apos;s an estimated <strong>{score}%
            probability</strong> that AI assistants will cite your site when
            answering relevant queries.
          </p>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ delay: delay + 0.4, duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${color.bg}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
