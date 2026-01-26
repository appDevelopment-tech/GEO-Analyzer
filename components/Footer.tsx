import Link from "next/link";

export const Footer = () => (
  <footer className="py-12 px-4 border-t border-apple-border mt-20">
    <div className="max-w-6xl mx-auto">
      {/* Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Product */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-white transition-colors">
                How It Works
              </Link>
            </li>
          </ul>
        </div>
        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center text-sm text-gray-200 pt-8 border-t border-gray-700">
        <p>
          © {new Date().getFullYear()} GEO Analyzer. Diagnostic tool for AI
          recommendation readiness.
        </p>
      </div>
    </div>
  </footer>
);
