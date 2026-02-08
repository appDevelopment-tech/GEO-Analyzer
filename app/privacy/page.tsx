import { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "Privacy Policy – GeoAnalyzer",
  description:
    "GeoAnalyzer's privacy policy. Learn how we collect, use, and protect your data when you use our GEO/AEO analysis service.",
  openGraph: {
    title: "Privacy Policy – GeoAnalyzer",
    description:
      "GeoAnalyzer's privacy policy. Learn how we collect, use, and protect your data when you use our GEO/AEO analysis service.",
    url: `${baseUrl}/privacy`,
  },
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  const lastUpdated = "January 26, 2026";

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
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </section>

        <section className="prose prose-invert max-w-none space-y-8">
          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                GeoAnalyzer collects the following information when you use our
                service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Website URL:</strong> The URL
                  you submit for analysis
                </li>
                <li>
                  <strong className="text-white">Email address:</strong>{" "}
                  Optional, used to deliver your report
                </li>
                <li>
                  <strong className="text-white">Payment information:</strong>{" "}
                  Processed securely by Stripe; we never store your card details
                </li>
                <li>
                  <strong className="text-white">Crawled content:</strong>{" "}
                  Publicly accessible pages from your website, analyzed for
                  GEO/AEO signals
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Perform GEO/AEO analysis on your website</li>
                <li>Generate and deliver your report</li>
                <li>Process payments (via Stripe)</li>
                <li>Send essential service communications</li>
                <li>Improve our analysis methodology</li>
              </ul>
              <p className="text-sm">
                We never sell your data to third parties. Your analysis results
                are private.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Data Storage and Retention
            </h2>
            <div className="space-y-4 text-gray-300">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Analysis results:</strong>{" "}
                  Stored securely for 30 days
                </li>
                <li>
                  <strong className="text-white">Email addresses:</strong>{" "}
                  Stored until you request deletion
                </li>
                <li>
                  <strong className="text-white">Payment data:</strong> Handled
                  exclusively by Stripe; we have no access to your card details
                </li>
                <li>
                  <strong className="text-white">Crawled content:</strong> Not
                  permanently stored; used only for immediate analysis
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Data Security
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>
                  Payment processing via PCI-compliant Stripe infrastructure
                </li>
                <li>Regular security audits and updates</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Stripe:</strong> Payment
                  processing
                </li>
                <li>
                  <strong className="text-white">OpenAI:</strong> AI-powered
                  analysis (data is not used for training)
                </li>
                <li>
                  <strong className="text-white">Netlify:</strong> Website
                  hosting
                </li>
              </ul>
              <p className="text-sm">
                These services have their own privacy policies. We encourage you
                to review them.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Your Rights
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the data we have about you</li>
                <li>Request deletion of your data</li>
                <li>
                  Opt out of marketing communications (we don't send marketing
                  emails)
                </li>
                <li>Export your data</li>
              </ul>
              <p className="text-sm">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:hello@maxpetrusenko.com"
                  className="text-blue-400 hover:underline"
                >
                  hello@maxpetrusenko.com
                </a>
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We use minimal cookies for essential functionality only. We do
                not use third-party tracking or advertising cookies. We may add
                analytics in the future to improve our service; any such changes
                will be reflected in this policy.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Children's Privacy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                GeoAnalyzer is not intended for children under 13. We do not
                knowingly collect information from children under 13.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update this privacy policy from time to time. Significant
                changes will be communicated via email (if provided) and on this
                page with an updated revision date.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Contact Us
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                For questions about this privacy policy or your data, contact us
                at:
              </p>
              <p>
                <a
                  href="mailto:hello@maxpetrusenko.com"
                  className="text-blue-400 hover:underline"
                >
                  hello@maxpetrusenko.com
                </a>
              </p>
            </div>
          </section>
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
