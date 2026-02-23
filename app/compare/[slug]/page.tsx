import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { AUTHORS, getAuthorHref } from "@/lib/authors";
import {
  comparisonPages,
  getComparisonHref,
  type ComparisonPage,
} from "@/lib/comparison-data";
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
} from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export async function generateStaticParams() {
  return comparisonPages.map((page) => ({ slug: page.slug }));
}

function getComparison(slug: string): ComparisonPage | undefined {
  return comparisonPages.find((page) => page.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found – GeoAnalyzer",
    };
  }

  const url = `${baseUrl}${getComparisonHref(comparison.slug)}`;

  return {
    title: `${comparison.title} – GeoAnalyzer`,
    description: comparison.description,
    openGraph: {
      title: `${comparison.title} – GeoAnalyzer`,
      description: comparison.description,
      url,
      type: "article",
      publishedTime: comparison.date,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  const author = AUTHORS[0];
  const pageUrl = `${baseUrl}${getComparisonHref(comparison.slug)}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.description,
    datePublished: comparison.date,
    dateModified: comparison.date,
    author: {
      "@type": "Person",
      "@id": `${baseUrl}${getAuthorHref(author.slug)}`,
      name: author.name,
      url: `${baseUrl}${getAuthorHref(author.slug)}`,
    },
    publisher: {
      "@type": "Organization",
      name: "GeoAnalyzer",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Compare", url: `${baseUrl}/compare` },
    { name: comparison.title, url: pageUrl },
  ]);

  const faqSchema = generateFAQPageSchema(
    comparison.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id={`schema-compare-article-${comparison.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id={`schema-compare-breadcrumb-${comparison.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`schema-compare-faq-${comparison.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

      <main className="max-w-5xl mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link
            href="/compare"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Comparison Hub
          </Link>
        </nav>

        <header className="mb-10">
          <p className="text-sm text-gray-400 mb-3">
            {new Date(comparison.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            ·{" "}
            <Link
              href={getAuthorHref(author.slug)}
              className="text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              {author.name}
            </Link>
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {comparison.title}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            {comparison.description}
          </p>
        </header>

        <section className="mb-12 bg-white rounded-2xl p-8 md:p-10 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Direct Answer
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {comparison.directAnswer}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Thesis and Tension
          </h2>
          <p className="text-gray-300 leading-relaxed">{comparison.tension}</p>
        </section>

        <section className="mb-12 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Comparison Table
          </h2>
          <table className="w-full min-w-[640px] border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800">
                <th className="text-left text-sm font-semibold text-gray-200 p-4 border-b border-gray-700">
                  Criterion
                </th>
                <th className="text-left text-sm font-semibold text-gray-200 p-4 border-b border-gray-700">
                  {comparison.optionAName}
                </th>
                <th className="text-left text-sm font-semibold text-gray-200 p-4 border-b border-gray-700">
                  {comparison.optionBName}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.criterion} className="bg-gray-900/60">
                  <td className="p-4 text-sm text-gray-200 border-b border-gray-700">
                    {row.criterion}
                  </td>
                  <td className="p-4 text-sm text-gray-300 border-b border-gray-700">
                    {row.optionA}
                  </td>
                  <td className="p-4 text-sm text-gray-300 border-b border-gray-700">
                    {row.optionB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-12 bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Action Plan</h2>
          <p className="text-gray-200 mb-5">
            <span className="font-semibold">Primary action:</span>{" "}
            {comparison.primaryAction}
          </p>
          <h3 className="text-lg font-semibold text-white mb-3">
            Secondary actions
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
            {comparison.secondaryActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold text-white mb-3">
            30-Day Execution Plan
          </h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            {comparison.executionPlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Reality Contact
          </h2>
          <p className="text-gray-300 leading-relaxed">{comparison.limitation}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">FAQs</h2>
          <div className="space-y-4">
            {comparison.faqs.map((faq) => (
              <blockquote
                key={faq.question}
                className="border-l-4 border-blue-500/70 bg-gray-900/40 rounded-r-lg px-4 py-3"
              >
                <p className="text-gray-100 font-semibold mb-1">{faq.question}</p>
                <p className="text-gray-300">{faq.answer}</p>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="pt-12 border-t border-gray-700">
          <p className="text-gray-400">
            Revisit the tension: this is rarely an either/or decision.
            Compounding performance comes from a canonical source model with
            explicit trade-offs. If your strategy cannot survive one hard
            counterexample, it is not yet a strategy.
          </p>
        </section>
      </main>
    </article>
  );
}
