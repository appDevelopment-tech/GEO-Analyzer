"use client";

import { motion } from "framer-motion";

interface BlurredPanelProps {
  title: string;
  icon: React.ReactNode;
  isLocked: boolean;
  onUnlock?: () => void;
  children: React.ReactNode;
  delay?: number;
}

export default function BlurredPanel({
  title,
  icon,
  isLocked,
  onUnlock,
  children,
  delay = 0,
}: BlurredPanelProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-2xl font-bold text-apple-gray">{title}</h3>
        {isLocked && (
          <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
            Premium
          </span>
        )}
      </div>

      {/* Content with conditional blur */}
      <div className="relative px-8 pb-8">
        <div
          className={
            isLocked ? "filter blur-[6px] select-none pointer-events-none" : ""
          }
        >
          {children}
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
            <div className="text-center px-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-apple-blue to-cyan-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
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
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Available in the full report
              </p>
              {onUnlock && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onUnlock}
                  className="px-8 py-3 bg-gradient-to-r from-apple-blue to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm"
                >
                  Unlock Full Report
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
