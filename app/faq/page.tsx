import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { generateFAQPageSchema } from "@/lib/schema-data";
import { Footer } from "@/components/Footer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "FAQ – GeoAnalyzer",
  description:
    "Frequently asked questions about GEO, GeoAnalyzer, pricing, and how to improve your AI recommendation readiness. Get answers to common questions.",
  openGraph: {
    title: "FAQ – GeoAnalyzer",
    description:
      "Frequently asked questions about GEO, GeoAnalyzer, pricing, and how to improve your AI recommendation readiness. Get answers to common questions.",
    url: `${baseUrl}/faq`,
  },
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
};

const faqs = [
  {
    question: "What is GEO vs SEO?",
    answer:
      "GEO (Generative Engine Optimization) focuses on making your content citable by AI chatbots and answer engines, while SEO (Search Engine Optimization) focuses on ranking in traditional search results. Both are important—SEO drives traffic from search engines like Google, while GEO helps you get recommended by AI assistants like ChatGPT, Claude, and Perplexity. The key difference is that GEO prioritizes direct answers, entity clarity, and trust signals that AI systems use when choosing sources to cite.",
  },
  {
    question: "What does the GEO score measure?",
    answer:
      "The GeoAnalyzer score (0-100) measures your website's readiness for AI recommendations across five categories: Entity Clarity (how well AI understands your brand), Direct Answers (how easily AI can extract answers from your content), Trust Signals (your credibility indicators), Competitive Positioning (how you compare to cited competitors), and Technical Accessibility (whether AI can access your content). The overall score combines these categories with a tier classification of Bronze, Silver, or Gold.",
  },
  {
    question: "How long does a GEO audit take?",
    answer:
      "The free preliminary score takes 30-60 seconds. We crawl your homepage and key pages, analyze your content structure, and evaluate your entity presence. The full report, available for $19, provides detailed breakdowns and recommendations immediately after purchase.",
  },
  {
    question: "What data sources does GeoAnalyzer use?",
    answer:
      "GeoAnalyzer directly crawls your website using the same methods AI engines employ. We analyze your HTML content, schema markup, heading structure, and trust signals. We also cross-reference public data sources for entity verification. Your URL and email are only used for the analysis and to deliver your report—we never share your data with third parties.",
  },
  {
    question: "Is the free score enough to get started?",
    answer:
      "The free score gives you a quick snapshot of your AI recommendation readiness with your overall score, tier classification, and the top hesitation AI might have about recommending you. It's useful for understanding where you stand. The full report ($19) provides detailed section breakdowns, specific recommendations, competitor comparisons, and a priority roadmap for improvements.",
  },
  {
    question: "How often should I run a GEO audit?",
    answer:
      "Run a GEO audit after making significant content changes, adding new schema markup, updating your about pages, or when you notice competitors being cited more frequently. For most websites, quarterly audits are sufficient. Tracking your score over time helps you understand which improvements have the biggest impact on your AI recommendation readiness.",
  },
  {
    question: "What's the difference between Bronze, Silver, and Gold tiers?",
    answer:
      "Bronze tier (0-59) indicates basic AI discoverability but weak citation signals. Silver tier (60-79) shows good AI presence with room for improvement. Gold tier (80-100) represents excellent AI readiness with strong signals for being cited by AI engines. Moving up a tier typically requires improvements in entity clarity, direct answer content, and trust signals.",
  },
  {
    question: "Can AI engines really understand my brand?",
    answer:
      "AI engines build understanding of entities (brands, products, people) by analyzing structured data like schema markup, knowledge graph entries (Wikipedia, Wikidata, Crunchbase), and consistent mentions across authoritative websites. If your entity information is unclear, inconsistent, or missing, AI engines will hesitate to recommend you even if you have great content. GeoAnalyzer's Entity Clarity score specifically measures this.",
  },
  {
    question: "Do I need technical skills to use GeoAnalyzer?",
    answer:
      "No technical skills are required to run the basic analysis—just enter your URL. The report provides recommendations that anyone can implement. Some suggestions, like adding schema markup or updating technical settings, may require a developer or access to your website's content management system.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Yes. We use industry-standard security practices including HTTPS encryption. Your analysis results are private and never shared. Email addresses are only used to deliver reports and essential communications. We do not sell your data to third parties. See our Privacy Policy for complete details.",
  },
];

const FAQ_SCHEMA = generateFAQPageSchema(faqs);

export default function FAQPage() {
  return (
    <>
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
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
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Answers to common questions about GEO (Generative Engine
              Optimization), how GeoAnalyzer works, pricing, and improving your
              AI recommendation readiness. Can't find what you're looking for?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact us
              </Link>
              .
            </p>
          </section>

          {/* FAQ Items */}
          <section className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-800 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h2 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h2>
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
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
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </section>

          {/* CTA */}
          <section className="text-center mt-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to check your GEO score?
            </h2>
            <p className="text-gray-400 mb-8">
              Get your free analysis in under 60 seconds.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Analyze My Site
            </a>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
