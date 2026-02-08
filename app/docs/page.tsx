import { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "How It Works – GeoAnalyzer",
  description:
    "Learn how GeoAnalyzer evaluates your website's AI recommendation readiness. Understand our scoring methodology across entity clarity, direct answers, trust signals, and more.",
  openGraph: {
    title: "How It Works – GeoAnalyzer",
    description:
      "Learn how GeoAnalyzer evaluates your website's AI recommendation readiness. Understand our scoring methodology across entity clarity, direct answers, trust signals, and more.",
    url: `${baseUrl}/docs`,
  },
  alternates: {
    canonical: `${baseUrl}/docs`,
  },
};

export default function DocsPage() {
  return (
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
            How does GeoAnalyzer score my website?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            GeoAnalyzer crawls your website like an AI engine would, evaluating
            five key areas that determine citation likelihood: entity clarity,
            direct answers, trust signals, competitive positioning, and
            technical accessibility. The analysis takes 30-60 seconds and
            returns a score from 0-100 with a tier classification (Bronze,
            Silver, or Gold).
          </p>
        </section>

        {/* How the Analysis Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            How the Analysis Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Enter Your URL
                </h3>
                <p className="text-gray-300">
                  Simply paste your website URL and optionally your email. We'll
                  begin crawling your site immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-300">
                  Our system analyzes your site using the same signals AI
                  engines consider when choosing sources to cite.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Get Your Score
                </h3>
                <p className="text-gray-300">
                  Receive your free preliminary score instantly. Upgrade to the
                  full report for detailed insights and recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scoring Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Scoring Categories
          </h2>

          <div className="space-y-8">
            {/* Entity Clarity */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Entity Clarity
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Measures how clearly AI engines understand who you are, what you
                offer, and why you're authoritative. This includes:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    Schema markup (Organization, Person, SoftwareApplication)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    Consistent NAP (Name, Address, Phone) across the web
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    Knowledge graph presence (Wikipedia, Wikidata, Crunchbase)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>About page clarity and team information</span>
                </li>
              </ul>
            </div>

            {/* Direct Answers */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Direct Answers
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Evaluates how well your content is structured for AI extraction.
                AI engines prefer content that directly answers questions
                without fluff.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>FAQ pages with structured Q&A format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>
                    Heading hierarchy (H1, H2, H3) for logical structure
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>FAQPage and Q&A schema markup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Concise answer blocks at the top of key pages</span>
                </li>
              </ul>
            </div>

            {/* Trust Signals */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Trust Signals</h3>
              </div>
              <p className="text-gray-300 mb-4">
                AI engines prioritize sources they can trust. We analyze your
                credibility indicators.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Reviews and ratings (Google, G2, Capterra, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Backlink profile quality and diversity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Media mentions and press coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>SSL certificate and security indicators</span>
                </li>
              </ul>
            </div>

            {/* Competitive Positioning */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Competitive Positioning
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Understanding how you stack up against competitors who are
                currently being cited by AI engines.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Comparison of your entity clarity vs. top competitors
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>Content breadth and depth comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>Authority and citation gap analysis</span>
                </li>
              </ul>
            </div>

            {/* Technical Accessibility */}
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Technical Accessibility
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Ensures AI engines can access and understand your content
                without technical barriers.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Page load speed and Core Web Vitals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Mobile-friendliness and responsive design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    Crawlability (robots.txt, no fatal blocking issues)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>JavaScript rendering for AI crawlers</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Score Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Understanding Your Tier
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-amber-900/50 to-gray-800 rounded-xl p-6 border border-amber-700">
              <div className="text-amber-400 text-lg font-semibold mb-2">
                Bronze Tier
              </div>
              <p className="text-gray-300 mb-2">Score: 0-59</p>
              <p className="text-gray-400 text-sm">
                Basic AI discoverability. Your site can be found but lacks
                strong signals for recommendation priority.
              </p>
            </div>
            <div className="bg-gradient-to-b from-gray-400/20 to-gray-800 rounded-xl p-6 border border-gray-500">
              <div className="text-gray-300 text-lg font-semibold mb-2">
                Silver Tier
              </div>
              <p className="text-gray-300 mb-2">Score: 60-79</p>
              <p className="text-gray-400 text-sm">
                Good AI presence. You have some citation signals but
                opportunities exist for improvement.
              </p>
            </div>
            <div className="bg-gradient-to-b from-yellow-600/30 to-gray-800 rounded-xl p-6 border border-yellow-500">
              <div className="text-yellow-400 text-lg font-semibold mb-2">
                Gold Tier
              </div>
              <p className="text-gray-300 mb-2">Score: 80-100</p>
              <p className="text-gray-400 text-sm">
                Excellent AI readiness. Your site has strong signals for being
                cited by AI engines.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to analyze your site?
          </h2>
          <p className="text-gray-400 mb-8">
            Get your free GEO score in under 60 seconds.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Analyze My Site
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">
            © 2026 GeoAnalyzer. All rights reserved.
          </p>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
