import React from "react";

export function LimitedOfferBadge() {
  return (
    <div className="flex items-center justify-center mb-6">
      <span className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg text-sm">
        Limited Time: <span className="font-bold">$1.50</span> for your full AI
        visibility report!
      </span>
    </div>
  );
}
