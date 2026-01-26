import { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geoanalyzer.netlify.app";

export const metadata: Metadata = {
  title: "Contact – GeoAnalyzer",
  description: "Get in touch with the GeoAnalyzer team. We're here to help with questions about GEO audits, pricing, and improving your AI recommendation readiness.",
  openGraph: {
    title: "Contact – GeoAnalyzer",
    description: "Get in touch with the GeoAnalyzer team. We're here to help with questions about GEO audits, pricing, and improving your AI recommendation readiness.",
    url: `${baseUrl}/contact`,
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            GeoAnalyzer
          </Link>
          <nav className="flex gap-6">
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Direct Answer Block */}
        <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How can I contact GeoAnalyzer?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            The fastest way to reach us is via email at contact@geoanalyzer.app. We typically
            respond within 24 hours on business days. For questions about your report, pricing,
            or technical issues, please include your order number or website URL for faster service.
          </p>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>
          <form className="bg-gray-800 rounded-xl p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a topic</option>
                <option value="general">General inquiry</option>
                <option value="support">Technical support</option>
                <option value="billing">Billing question</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Other Contact Methods */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Email</h3>
            <a
              href="mailto:contact@geoanalyzer.app"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              contact@geoanalyzer.app
            </a>
            <p className="text-gray-400 text-sm mt-2">
              Response time: Within 24 hours on business days
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Business Inquiries</h3>
            <a
              href="mailto:business@geoanalyzer.app"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              business@geoanalyzer.app
            </a>
            <p className="text-gray-400 text-sm mt-2">
              For partnerships, enterprise plans, and media inquiries
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-16 bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Looking for answers?</h2>
          <p className="text-gray-300 mb-6">
            Before reaching out, check our FAQ for quick answers to common questions about GEO,
            scoring, and pricing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View FAQ
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              How It Works
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2025 GeoAnalyzer. All rights reserved.</p>
          <nav className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
