"use client";

import BlurredPanel from "./BlurredPanel";

interface FixRoadmapPanelProps {
  fixPlan: string[];
  isLocked: boolean;
  onUnlock?: () => void;
  delay?: number;
}

export default function FixRoadmapPanel({
  fixPlan,
  isLocked,
  onUnlock,
  delay = 3.4,
}: FixRoadmapPanelProps) {
  if (!fixPlan || fixPlan.length === 0) return null;

  return (
    <BlurredPanel
      title="Your Week 1 Fix Roadmap"
      icon={
        <svg
          className="w-7 h-7 text-green-500"
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
      }
      isLocked={isLocked}
      onUnlock={onUnlock}
      delay={delay}
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-200 rounded-full" />

        <div className="space-y-5">
          {fixPlan.map((item, index) => {
            const isFirst = index === 0;
            return (
              <div key={index} className="flex items-start gap-4 relative">
                {/* Timeline dot */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                    isFirst
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 rounded-xl p-4 ${
                    isFirst
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed ${
                      isFirst ? "text-green-800 font-medium" : "text-gray-600"
                    }`}
                  >
                    {item}
                  </p>
                  {isFirst && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Start here
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BlurredPanel>
  );
}
