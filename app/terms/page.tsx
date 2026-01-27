import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geoanalyzer.netlify.app";

export const metadata: Metadata = {
  title: "Terms of Service – GeoAnalyzer",
  description:
    "GeoAnalyzer's terms of service. Understand the terms and conditions for using our GEO/AEO/AI analysis service.",
  openGraph: {
    title: "Terms of Service – GeoAnalyzer",
    description:
      "GeoAnalyzer's terms of service. Understand the terms and conditions for using our GEO/AEO/AI analysis service.",
    url: `${baseUrl}/terms`,
  },
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </section>

        <section className="prose prose-invert max-w-none space-y-8">
          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By accessing or using GeoAnalyzer ("Service"), you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, please do not use the Service.
              </p>
              <p>
                GeoAnalyzer reserves the right to modify these Terms at any
                time. Your continued use of the Service after changes
                constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Description of Service
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                GeoAnalyzer provides a website analysis tool that evaluates your
                website's readiness for AI recommendation engines (GEO
                analysis). The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free preliminary GEO score</li>
                <li>Full paid reports with detailed recommendations</li>
                <li>
                  Analysis of entity clarity, direct answers, trust signals, and
                  more
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. User Responsibilities
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>As a user of GeoAnalyzer, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information when using the Service</li>
                <li>
                  Only submit URLs for websites you own or have permission to
                  analyze
                </li>
                <li>
                  Not attempt to circumvent usage limits or exploit the Service
                </li>
                <li>
                  Not use the Service for any illegal or unauthorized purpose
                </li>
                <li>
                  Not reproduce, redistribute, or resell our reports without
                  permission
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Payment Terms
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                For full reports, payment is processed through Stripe. By
                purchasing, you agree to Stripe's terms of service.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-white">Pricing:</strong> Current
                  pricing is displayed on our website
                </li>
                <li>
                  <strong className="text-white">Refunds:</strong> Refunds are
                  handled on a case-by-case basis. Contact us within 14 days of
                  purchase if you have issues.
                </li>
                <li>
                  <strong className="text-white">Delivery:</strong> Reports are
                  delivered immediately after successful payment
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                GeoAnalyzer and its original content, features, and
                functionality are owned by GeoAnalyzer and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
              <p>
                Reports generated by the Service are for your personal or
                business use. Resale or redistribution of reports without
                written permission is prohibited.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Disclaimer of Warranties
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Service is provided "as is" without warranties of any kind,
                either express or implied. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>That the Service will be uninterrupted or error-free</li>
                <li>
                  That results will be accurate or applicable to your situation
                </li>
                <li>
                  That implementing recommendations will improve AI rankings
                </li>
              </ul>
              <p className="text-sm">
                GEO is an emerging field, and AI engine behavior is not fully
                within our control. Our recommendations are based on current
                best practices and research.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                To the fullest extent permitted by law, GeoAnalyzer shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to lost profits,
                data loss, or business interruption.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Termination
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We reserve the right to suspend or terminate your access to the
                Service at any time, with or without cause, with or without
                notice.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Governing Law
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which GeoAnalyzer is
                established, without regard to conflict of law provisions.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Contact Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>For questions about these Terms, please contact us at:</p>
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

      <Footer />
    </div>
  );
}
