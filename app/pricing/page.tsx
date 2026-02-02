import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { generateSoftwareApplicationSchema } from "@/lib/schema-data";
import { Footer } from "@/components/Footer";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "Pricing – GeoAnalyzer",
  description:
    "Simple, transparent pricing for comprehensive GEO audits. Get actionable insights on entity clarity, direct answers, trust signals, and competitive positioning.",
  openGraph: {
    title: "Pricing – GeoAnalyzer",
    description:
      "Simple, transparent pricing for comprehensive GEO audits. Get actionable insights on entity clarity, direct answers, trust signals, and competitive positioning.",
    url: `${baseUrl}/pricing`,
  },
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
};

const SOFTWARE_SCHEMA = {
  ...generateSoftwareApplicationSchema(),
  "@context": "https://schema.org",
};

export default function PricingPage() {
  return (
    <>
      <Script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header */}
        <header className="border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              GeoAnalyzer
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/docs"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/faq"
                className="text-gray-300 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Direct Answer Block */}
          <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What does GeoAnalyzer cost?
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              GeoAnalyzer offers a free preliminary score. For comprehensive GEO
              audits with detailed recommendations, the full report costs $19.
              Each report includes entity clarity analysis, direct answer
              optimization, trust signal evaluation, competitive positioning,
              and technical accessibility assessment.
            </p>
          </section>

          {/* Pricing Cards */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Tier */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Free Score
                </h2>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
                  $0
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Overall GEO score (0-100)</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Tier classification (Bronze/Silver/Gold)</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Top hesitation identified</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Instant results</span>
                  </li>
                </ul>
                <Link
                  href="/"
                  className="block w-full text-center py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Get Free Score
                </Link>
              </div>

              {/* Full Report */}
              <div className="bg-gradient-to-b from-blue-900 to-cyan-900 rounded-2xl p-8 border border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Full Report
                </h2>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">
                  $19
                </div>
                <p className="text-gray-300 mb-6">one-time payment</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Everything in Free Score</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Detailed section breakdowns</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Actionable fix recommendations</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Competitor comparison data</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority improvement roadmap</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>PDF export for sharing</span>
                  </li>
                </ul>
                <Link
                  href="/"
                  className="block w-full text-center py-3 px-6 bg-white hover:bg-gray-100 text-blue-900 font-semibold rounded-xl transition-colors"
                >
                  Get Full Report
                </Link>
              </div>
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              What's in the Full Report?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Entity Clarity Analysis
                </h3>
                <p className="text-gray-300">
                  Assessment of how clearly AI engines understand your brand,
                  products, and expertise. Includes schema markup review and
                  knowledge graph presence.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Direct Answers Score
                </h3>
                <p className="text-gray-300">
                  Evaluation of content structured for AI extraction. Analyzes
                  headings, FAQs, and answer blocks that engines prefer for
                  citation.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Trust Signals Review
                </h3>
                <p className="text-gray-300">
                  Analysis of credibility indicators including reviews,
                  citations, backlinks, and authority signals that AI systems
                  use to verify sources.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Competitive Positioning
                </h3>
                <p className="text-gray-300">
                  Comparison with top competitors in AI recommendations.
                  Understand why others are chosen and how to improve your
                  standing.
                </p>
              </div>
            </div>
          </section>

          {/* Payment & Security */}
          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Secure Payment
            </h2>
            <p className="text-gray-300 mb-6">
              Payments are processed securely by Stripe. We never store your
              card information. You'll receive your full report immediately
              after payment.
            </p>
            <div className="flex items-center gap-4">
              <svg
                className="h-8"
                viewBox="0 0 50 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35 10H15C13.3431 10 12 11.3431 12 13V23C12 24.6569 13.3431 26 15 26H35C36.6569 26 38 24.6569 38 23V13C38 11.3431 36.6569 10 35 10Z"
                  fill="#635BFF"
                />
              </svg>
              <span className="text-gray-400">Powered by Stripe</span>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
