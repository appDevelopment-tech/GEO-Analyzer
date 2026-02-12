"use client";

import { motion } from "framer-motion";
import { AIQuerySimulation, RealCompetitor } from "@/types/geo";

interface CompetitorSnapshotProps {
  simulations: AIQuerySimulation[];
  realCompetitors?: RealCompetitor[];
  isLocked?: boolean;
  delay?: number;
}

/**
 * Shows real competitors and their AI readiness — motivating, always partially free.
 * Free users see names + mention counts. Paid users also see AI readiness scores + strengths.
 */
export default function CompetitorSnapshot({
  simulations,
  realCompetitors,
  isLocked = true,
  delay = 3.4,
}: CompetitorSnapshotProps) {
  if (!simulations || simulations.length === 0) return null;

  // Aggregate competitors from query simulations
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

  if (
    sortedCompetitors.length === 0 &&
    (!realCompetitors || realCompetitors.length === 0)
  )
    return null;

  const mentionedCount = simulations.filter((s) => s.mentioned).length;
  const totalQueries = simulations.length;
  const mentionRate = Math.round((mentionedCount / totalQueries) * 100);

  // Build a lookup from real competitors for enrichment
  const competitorLookup = new Map<string, RealCompetitor>();
  if (realCompetitors) {
    for (const rc of realCompetitors) {
      competitorLookup.set(rc.name.toLowerCase(), rc);
    }
  }

  // Merge: use simulation competitors enriched with real competitor data
  const enrichedCompetitors = sortedCompetitors.map(([name, count]) => {
    const rc = competitorLookup.get(name.toLowerCase());
    return {
      name,
      count,
      readiness: rc?.ai_readiness_estimate,
      strengths: rc?.strengths,
      url: rc?.url,
    };
  });

  // Add real competitors not in simulations
  if (realCompetitors) {
    for (const rc of realCompetitors) {
      if (
        !enrichedCompetitors.some(
          (e) => e.name.toLowerCase() === rc.name.toLowerCase(),
        )
      ) {
        enrichedCompetitors.push({
          name: rc.name,
          count: 0,
          readiness: rc.ai_readiness_estimate,
          strengths: rc.strengths,
          url: rc.url,
        });
      }
    }
  }

  const topCompetitors = enrichedCompetitors.slice(0, 6);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </span>
        <div>
          <h3 className="text-2xl font-bold text-apple-gray">
            Who AI Picks Instead
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Real competitors AI recommends when you&apos;re not cited
          </p>
        </div>
      </div>

      {/* Mention rate bar */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-gray-600">
            Your mention rate
          </span>
          <span
            className={`text-lg font-bold ${mentionRate >= 50 ? "text-green-600" : mentionRate >= 25 ? "text-yellow-600" : "text-red-600"}`}
          >
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
          AI mentioned you in {mentionedCount} of {totalQueries} simulated
          queries
        </p>
      </div>

      {/* Competitors list */}
      {topCompetitors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Taking your spot in AI answers
          </p>
          <div className="space-y-2">
            {topCompetitors.map(
              ({ name, count, readiness, strengths, url }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.4 + i * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-apple-gray truncate">
                        {name}
                      </span>
                      {url && (
                        <span className="text-xs text-gray-400 truncate hidden sm:inline">
                          {url
                            .replace(/^https?:\/\/(www\.)?/, "")
                            .replace(/\/$/, "")}
                        </span>
                      )}
                    </div>
                    {/* Strengths — visible for paid users when data exists */}
                    {strengths && strengths.length > 0 && !isLocked && (
                      <div className="flex gap-1.5 mt-1">
                        {strengths.map((s, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* AI readiness score — paid only */}
                  {readiness !== undefined && !isLocked ? (
                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-bold ${readiness >= 70 ? "text-green-600" : readiness >= 45 ? "text-yellow-600" : "text-red-500"}`}
                      >
                        {readiness}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        AI score
                      </span>
                    </div>
                  ) : count > 0 ? (
                    <span className="ml-auto text-xs text-gray-400 shrink-0">
                      {count}x cited
                    </span>
                  ) : null}
                </motion.div>
              ),
            )}
          </div>
          {isLocked && realCompetitors && realCompetitors.length > 0 && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              Unlock full report to see competitor AI readiness scores &amp;
              strengths
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
