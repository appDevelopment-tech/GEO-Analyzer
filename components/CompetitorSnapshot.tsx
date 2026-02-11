"use client";

import { motion } from "framer-motion";
import { AIQuerySimulation } from "@/types/geo";

interface CompetitorSnapshotProps {
  simulations: AIQuerySimulation[];
  delay?: number;
}

/**
 * Shows who AI mentions instead of this site — motivating, always free.
 * Pulls competitor data from the first AI query simulation result.
 */
export default function CompetitorSnapshot({
  simulations,
  delay = 3.4,
}: CompetitorSnapshotProps) {
  if (!simulations || simulations.length === 0) return null;

  // Aggregate all competitors across all simulations
  const competitorCounts = new Map<string, number>();
  let totalNotMentioned = 0;

  for (const sim of simulations) {
    if (!sim.mentioned) totalNotMentioned++;
    for (const comp of sim.competitors_mentioned || []) {
      competitorCounts.set(comp, (competitorCounts.get(comp) || 0) + 1);
    }
  }

  const sortedCompetitors = Array.from(competitorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (sortedCompetitors.length === 0 && totalNotMentioned === 0) return null;

  const mentionedCount = simulations.filter((s) => s.mentioned).length;
  const totalQueries = simulations.length;
  const mentionRate = Math.round((mentionedCount / totalQueries) * 100);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </span>
        <div>
          <h3 className="text-2xl font-bold text-apple-gray">Who AI Picks Instead</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Competitors mentioned when you&apos;re not
          </p>
        </div>
      </div>

      {/* Mention rate bar */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-gray-600">Your mention rate</span>
          <span className={`text-lg font-bold ${mentionRate >= 50 ? "text-green-600" : mentionRate >= 25 ? "text-yellow-600" : "text-red-600"}`}>
            {mentionRate}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mentionRate}%` }}
            transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${mentionRate >= 50 ? "bg-green-500" : mentionRate >= 25 ? "bg-yellow-500" : "bg-red-500"}`}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          AI mentioned you in {mentionedCount} of {totalQueries} simulated customer queries
        </p>
      </div>

      {/* Competitors list */}
      {sortedCompetitors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Taking your spot in AI answers
          </p>
          <div className="grid grid-cols-2 gap-2">
            {sortedCompetitors.map(([name, count], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 + i * 0.1, duration: 0.3 }}
                className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-apple-gray truncate">{name}</span>
                <span className="ml-auto text-xs text-gray-400 shrink-0">
                  {count}x
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
