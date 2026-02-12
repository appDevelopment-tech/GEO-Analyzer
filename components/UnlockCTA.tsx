"use client";

import { motion } from "framer-motion";

interface UnlockCTAProps {
  onCheckout: () => void;
  delay?: number;
}

/**
 * Standalone unlock CTA block — placed lower on the page after free value.
 */
export default function UnlockCTA({ onCheckout, delay = 4.0 }: UnlockCTAProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="p-8 md:p-10">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Full Report
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          The free scan shows the problem.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            The full report shows the fix.
          </span>
        </h3>

        <p className="text-gray-400 mb-6 leading-relaxed">
          AI isn&apos;t recommending you for a reason — usually several. Your
          full report uncovers every hesitation and tells you exactly what to
          change.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm mb-1">
              Every AI hesitation
            </p>
            <p className="text-gray-500 text-xs">
              Broken down with evidence, not just flagged
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm mb-1">
              1-week action plan
            </p>
            <p className="text-gray-500 text-xs">
              Prioritized fixes you can start Monday
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm mb-1">
              PDF report emailed
            </p>
            <p className="text-gray-500 text-xs">
              Professional consultant-style audit document
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Get Your Full Report
        </motion.button>

        <p className="text-center text-gray-500 text-xs mt-3">
          One-time purchase. No subscription.
        </p>
      </div>
    </motion.div>
  );
}
