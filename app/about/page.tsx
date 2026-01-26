import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geoanalyzer.netlify.app";

export const metadata: Metadata = {
  title: "About – GeoAnalyzer",
  description:
    "Learn about GeoAnalyzer's mission to help websites optimize for AI recommendation engines. Our methodology, team, and commitment to transparent GEO analysis.",
  openGraph: {
    title: "About – GeoAnalyzer",
    description:
      "Learn about GeoAnalyzer's mission to help websites optimize for AI recommendation engines. Our methodology, team, and commitment to transparent GEO analysis.",
    url: `${baseUrl}/about`,
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Simple Nav */}
      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">
            GeoAnalyzer
          </Link>
          <nav className="flex gap-4 text-sm">
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
              href="/faq"
              className="text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Direct Answer Block */}
        <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What is GeoAnalyzer?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            GeoAnalyzer is a GEO (Generative Engine Optimization) tool that
            helps websites understand and improve their readiness for AI
            recommendation engines. We analyze your site using the same signals
            that AI chatbots and answer engines consider when choosing sources
            to cite, then provide actionable recommendations for improvement.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <div className="bg-gray-800 rounded-xl p-8">
            <p className="text-gray-300 leading-relaxed mb-6">
              As AI becomes the primary way people find information, businesses
              need to understand how these engines choose their sources. Unlike
              traditional SEO, which has decades of best practices and tools,
              GEO is still emerging—and many websites are unprepared.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              GeoAnalyzer exists to bridge this gap. We help website owners,
              marketers, and SEO professionals understand how AI engines
              perceive their content and provide clear, actionable steps to
              become more citable.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We believe that transparent, accessible GEO analysis should be
              available to everyone, not just large enterprises with dedicated
              AI teams. That's why we offer a free preliminary score and
              affordable full reports.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Our Methodology
          </h2>
          <div className="bg-gray-800 rounded-xl p-8">
            <p className="text-gray-300 leading-relaxed mb-6">
              GeoAnalyzer's scoring methodology is based on research into how AI
              engines select and verify sources. We analyze five key categories:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Entity Clarity
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Can AI understand who you are, what you offer, and why
                    you're authoritative?
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Direct Answers
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Is your content structured for AI extraction and citation?
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Trust Signals
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Do you have the credibility indicators AI engines use to
                    verify sources?
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Competitive Positioning
                  </h3>
                  <p className="text-gray-400 text-sm">
                    How do you compare to competitors currently being cited?
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Technical Accessibility
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Can AI engines access and understand your content without
                    barriers?
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Privacy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Data Privacy</h2>
          <div className="bg-gray-800 rounded-xl p-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              We take your privacy seriously. When you run a GeoAnalyzer audit:
            </p>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
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
                <span>
                  We crawl only publicly accessible pages of your website
                </span>
              </li>
              <li className="flex items-start gap-2">
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
                <span>
                  Your results are private and never shared with third parties
                </span>
              </li>
              <li className="flex items-start gap-2">
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
                <span>Email addresses are used only for report delivery</span>
              </li>
              <li className="flex items-start gap-2">
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
                <span>
                  We use industry-standard security practices including HTTPS
                  encryption
                </span>
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              See our{" "}
              <Link href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>{" "}
              for complete details.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to improve your AI recommendation readiness?
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

      <Footer />
    </div>
  );
}
