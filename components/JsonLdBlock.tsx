"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface JsonLdBlockProps {
  domain: string;
  extractedJsonLd: any[];
  extractedFaqs: string[];
  delay?: number;
}

/**
 * Auto-generates recommended JSON-LD structured data based on what's
 * missing from the site. Users can copy-paste it directly into their <head>.
 */
export default function JsonLdBlock({
  domain,
  extractedJsonLd,
  extractedFaqs,
  delay = 3.0,
}: JsonLdBlockProps) {
  const [copied, setCopied] = useState(false);

  // Determine what schema types already exist on the site
  const existingTypes = useMemo(() => {
    const types = new Set<string>();
    for (const item of extractedJsonLd || []) {
      if (typeof item === "object" && item) {
        const graph = item["@graph"] || [item];
        for (const g of graph) {
          if (typeof g === "object" && g && g["@type"]) {
            const t = g["@type"];
            if (Array.isArray(t)) t.forEach((x: string) => types.add(x));
            else types.add(t);
          }
        }
      }
    }
    return types;
  }, [extractedJsonLd]);

  // Extract business name from existing JSON-LD if available
  const businessName = useMemo(() => {
    for (const item of extractedJsonLd || []) {
      if (typeof item === "object" && item) {
        const graph = item["@graph"] || [item];
        for (const g of graph) {
          if (typeof g === "object" && g) {
            if (g.name && typeof g.name === "string") return g.name;
          }
        }
      }
    }
    // Fallback: clean domain
    return domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }, [extractedJsonLd, domain]);

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const fullUrl = domain.startsWith("http") ? domain : `https://${domain}`;

  // Build the recommended JSON-LD
  const generatedJsonLd = useMemo(() => {
    const graph: any[] = [];

    // Always include WebSite if missing
    if (!existingTypes.has("WebSite")) {
      graph.push({
        "@type": "WebSite",
        name: businessName,
        url: fullUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${fullUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }

    // Always include Organization if missing
    if (!existingTypes.has("Organization") && !existingTypes.has("LocalBusiness")) {
      graph.push({
        "@type": "Organization",
        name: businessName,
        url: fullUrl,
        logo: `${fullUrl}/logo.png`,
        sameAs: [
          "https://facebook.com/YOUR_PAGE",
          "https://twitter.com/YOUR_HANDLE",
          "https://linkedin.com/company/YOUR_COMPANY",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello@" + cleanDomain,
        },
      });
    }

    // Add FAQPage if missing and we have FAQ data or can suggest placeholders
    if (!existingTypes.has("FAQPage")) {
      const faqItems =
        extractedFaqs && extractedFaqs.length > 0
          ? extractedFaqs.slice(0, 5).map((faq) => ({
              "@type": "Question",
              name: faq,
              acceptedAnswer: {
                "@type": "Answer",
                text: "YOUR ANSWER HERE — replace with a concise 1-2 sentence answer.",
              },
            }))
          : [
              {
                "@type": "Question",
                name: `What does ${businessName} do?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "YOUR ANSWER — describe your core service in 1-2 clear sentences.",
                },
              },
              {
                "@type": "Question",
                name: `Where is ${businessName} located?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "YOUR ANSWER — include your full address and service area.",
                },
              },
              {
                "@type": "Question",
                name: `How do I contact ${businessName}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "YOUR ANSWER — include phone, email, and business hours.",
                },
              },
            ];

      graph.push({
        "@type": "FAQPage",
        mainEntity: faqItems,
      });
    }

    // If nothing is missing, show an optimized version of what they have
    if (graph.length === 0) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }, [existingTypes, businessName, fullUrl, cleanDomain, extractedFaqs]);

  if (!generatedJsonLd) {
    return (
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.6 }}
        className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h3 className="text-2xl font-bold text-apple-gray">Structured Data</h3>
          <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            Good
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Your site already has Organization, WebSite, and FAQPage schemas. The full report includes
          specific improvements to optimize your existing structured data for better AI citation.
        </p>
      </motion.div>
    );
  }

  const jsonStr = JSON.stringify(generatedJsonLd, null, 2);
  const scriptTag = `<script type="application/ld+json">\n${jsonStr}\n</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = scriptTag;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const missingCount = generatedJsonLd["@graph"]?.length || 0;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          <div>
            <h3 className="text-2xl font-bold text-apple-gray">
              Your JSON-LD — Copy &amp; Paste
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {missingCount} missing schema{missingCount !== 1 ? "s" : ""} generated for your site
            </p>
          </div>
          <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
            Free
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div className="px-8 pb-4">
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
          <p className="text-sm text-violet-900 leading-relaxed">
            AI systems like ChatGPT, Perplexity, and Gemini rely on structured data to understand
            and cite your website. We detected {missingCount > 0 ? `${missingCount} missing schema type${missingCount !== 1 ? "s" : ""}` : "gaps"} on
            your site. Paste this into your <code className="bg-violet-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;head&gt;</code> tag
            and replace the placeholder values.
          </p>
        </div>
      </div>

      {/* Code block */}
      <div className="px-8 pb-8">
        <div className="relative group">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>

          <pre className="bg-gray-900 text-gray-200 rounded-xl p-5 pr-20 overflow-x-auto text-xs leading-relaxed font-mono max-h-80 overflow-y-auto">
            <code>{scriptTag}</code>
          </pre>
        </div>

        {/* What each schema does */}
        <div className="mt-4 grid gap-2">
          {generatedJsonLd["@graph"]?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-apple-gray">{item["@type"]}</span>
                <span className="text-gray-500 ml-1.5">
                  {item["@type"] === "Organization"
                    ? "— tells AI who you are, your logo, and social profiles"
                    : item["@type"] === "WebSite"
                      ? "— helps AI identify your site and enable search actions"
                      : item["@type"] === "FAQPage"
                        ? "— provides direct answers AI can extract and cite"
                        : item["@type"] === "LocalBusiness"
                          ? "— establishes your location, hours, and contact for local AI queries"
                          : "— provides structured context for AI systems"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
