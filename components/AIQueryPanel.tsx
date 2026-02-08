"use client";

import { motion } from "framer-motion";
import { AIQuerySimulation } from "@/types/geo";
import BlurredPanel from "./BlurredPanel";

interface AIQueryPanelProps {
  simulations: AIQuerySimulation[];
  isLocked: boolean;
  onUnlock?: () => void;
  delay?: number;
}

function QueryCard({ sim, index }: { sim: AIQuerySimulation; index: number }) {
  const positionLabel = sim.position
    ? `${sim.position}${sim.position === 1 ? "st" : sim.position === 2 ? "nd" : sim.position === 3 ? "rd" : "th"} mentioned`
    : null;

  return (
    <motion.div
      initial={{ x: -15, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50"
    >
      {/* Query */}
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-apple-gray leading-relaxed">
          &ldquo;{sim.query}&rdquo;
        </p>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3 ml-10">
        {sim.mentioned ? (
          <>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Mentioned
            </span>
            {positionLabel && (
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                {positionLabel}
              </span>
            )}
          </>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Not Found
          </span>
        )}
      </div>

      {/* Snippet */}
      <div className="ml-10 bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed italic">
          {sim.snippet}
        </p>
      </div>

      {/* Competitors */}
      {sim.competitors_mentioned.length > 0 && (
        <div className="ml-10 mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium">
            AI mentioned instead:
          </span>
          {sim.competitors_mentioned.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function AIQueryPanel({
  simulations,
  isLocked,
  onUnlock,
  delay = 2.4,
}: AIQueryPanelProps) {
  if (!simulations || simulations.length === 0) return null;

  const firstQuery = simulations[0];
  const restQueries = simulations.slice(1);
  const mentionedCount = simulations.filter((s) => s.mentioned).length;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10"
    >
      {/* Header card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex items-center gap-3">
          <span className="text-2xl">
            <svg
              className="w-7 h-7 text-apple-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </span>
          <h3 className="text-2xl font-bold text-apple-gray">
            How AI Sees You
          </h3>
          <span className="ml-auto text-sm font-semibold text-gray-400">
            {mentionedCount}/{simulations.length} queries mention you
          </span>
        </div>

        <div className="px-8 pb-4">
          <p className="text-sm text-gray-500">
            We asked an AI assistant {simulations.length} questions your
            customers might ask. Here&apos;s whether you showed up.
          </p>
        </div>

        {/* First query - always visible */}
        <div className="px-8 pb-6">
          <QueryCard sim={firstQuery} index={0} />
        </div>
      </div>

      {/* Remaining queries - blurred for free */}
      {restQueries.length > 0 && (
        <BlurredPanel
          title={`${restQueries.length} More Queries`}
          icon={
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          }
          isLocked={isLocked}
          onUnlock={onUnlock}
          delay={delay + 0.3}
        >
          <div className="space-y-4">
            {restQueries.map((sim, i) => (
              <QueryCard key={sim.query} sim={sim} index={i + 1} />
            ))}
          </div>
        </BlurredPanel>
      )}
    </motion.div>
  );
}
