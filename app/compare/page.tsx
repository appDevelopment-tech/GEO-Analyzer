import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  comparisonPages,
  getComparisonHref,
} from "@/lib/comparison-data";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "GEO Comparison Hub – GeoAnalyzer",
  description:
    "Programmatic GEO, AEO, and SEO comparison pages with direct answers, trade-offs, and implementation plans.",
  openGraph: {
    title: "GEO Comparison Hub – GeoAnalyzer",
    description:
      "Programmatic GEO, AEO, and SEO comparison pages with direct answers, trade-offs, and implementation plans.",
    url: `${baseUrl}/compare`,
  },
  alternates: {
    canonical: `${baseUrl}/compare`,
  },
};

export default function ComparisonHubPage() {
  const pages = [...comparisonPages].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Compare", url: `${baseUrl}/compare` },
  ]);

  const itemListSchema = generateItemListSchema(
    pages.map((page) => ({
      name: page.title,
      url: `${baseUrl}${getComparisonHref(page.slug)}`,
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id="schema-compare-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-compare-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            GeoAnalyzer
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/compare"
              className="text-white transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="mb-12 bg-white rounded-2xl p-8 md:p-10 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GEO / AEO Comparison Hub
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Decision pages built for operators who need trade-offs, risks, and
            execution plans instead of generic advice.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={getComparisonHref(page.slug)}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
            >
              <p className="text-xs text-gray-500 mb-2">
                {new Date(page.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h2 className="text-xl font-semibold text-white mb-3">
                {page.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {page.description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
