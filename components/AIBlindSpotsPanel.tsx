"use client";

import BlurredPanel from "./BlurredPanel";

interface Hesitation {
  issue: string;
  why_ai_hesitates: string;
  evidence: string[];
  affected_urls: string[];
}

interface AIBlindSpotsPanelProps {
  hesitations: Hesitation[];
  isLocked: boolean;
  onUnlock?: () => void;
  delay?: number;
}

function HesitationCard({
  hesitation,
  index,
}: {
  hesitation: Hesitation;
  index: number;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600">
          {index + 1}
        </span>
        <h4 className="font-semibold text-apple-gray text-sm leading-relaxed">
          {hesitation.issue}
        </h4>
      </div>

      <div className="ml-10">
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {hesitation.why_ai_hesitates}
        </p>

        {hesitation.evidence.length > 0 && (
          <div className="bg-amber-50 border-l-3 border-amber-400 rounded-r-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1.5">
              Evidence
            </p>
            <ul className="space-y-1">
              {hesitation.evidence.map((e, i) => (
                <li
                  key={i}
                  className="text-xs text-amber-800 flex items-start gap-1.5"
                >
                  <span className="text-amber-500 mt-0.5 shrink-0">&bull;</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIBlindSpotsPanel({
  hesitations,
  isLocked,
  onUnlock,
  delay = 3.0,
}: AIBlindSpotsPanelProps) {
  // Only show if there are hesitations beyond the first one (first is shown separately)
  const extraHesitations = hesitations.slice(1, 4);
  if (extraHesitations.length === 0) return null;

  return (
    <BlurredPanel
      title="Your AI Blind Spots"
      icon={
        <svg
          className="w-7 h-7 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      }
      isLocked={isLocked}
      onUnlock={onUnlock}
      delay={delay}
    >
      <div className="space-y-4">
        {extraHesitations.map((h, i) => (
          <HesitationCard key={h.issue} hesitation={h} index={i + 1} />
        ))}
      </div>
    </BlurredPanel>
  );
}
