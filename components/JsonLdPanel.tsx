"use client";

import { useState } from "react";
import { GeneratedJsonLd } from "@/types/geo";
import BlurredPanel from "./BlurredPanel";

interface JsonLdPanelProps {
  blocks: GeneratedJsonLd[];
  isLocked: boolean;
  onUnlock?: () => void;
  delay?: number;
}

function JsonLdBlock({ block }: { block: GeneratedJsonLd }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const scriptTag = `<script type="application/ld+json">\n${block.code}\n</script>`;
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {block.type}
          </span>
          <span className="text-sm font-semibold text-apple-gray">
            {block.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs font-medium text-gray-600 hover:text-blue-600"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          {block.description}
        </p>
      </div>

      {/* Code */}
      <div className="px-5 py-4 bg-gray-900 overflow-x-auto">
        <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
          <span className="text-gray-500">&lt;script type=&quot;application/ld+json&quot;&gt;</span>
          {"\n"}
          {block.code}
          {"\n"}
          <span className="text-gray-500">&lt;/script&gt;</span>
        </pre>
      </div>
    </div>
  );
}

export default function JsonLdPanel({
  blocks,
  isLocked,
  onUnlock,
  delay = 3.8,
}: JsonLdPanelProps) {
  if (!blocks || blocks.length === 0) return null;

  const firstBlock = blocks[0];
  const restBlocks = blocks.slice(1);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Header + first block always visible */}
      <BlurredPanel
        title="Ready-to-Paste Schema Markup"
        icon={
          <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        }
        isLocked={false}
        delay={delay}
      >
        <p className="text-sm text-gray-500 mb-4">
          Add these to your site&apos;s &lt;head&gt; section. Each block improves
          how AI engines understand and cite your content.
        </p>
        <JsonLdBlock block={firstBlock} />
      </BlurredPanel>

      {/* Rest blurred for free */}
      {restBlocks.length > 0 && (
        <BlurredPanel
          title={`${restBlocks.length} More Schema Blocks`}
          icon={
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          }
          isLocked={isLocked}
          onUnlock={onUnlock}
          delay={delay + 0.3}
        >
          <div className="space-y-4">
            {restBlocks.map((block) => (
              <JsonLdBlock key={block.type} block={block} />
            ))}
          </div>
        </BlurredPanel>
      )}
    </div>
  );
}
