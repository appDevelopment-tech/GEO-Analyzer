import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { AUTHORS, getAuthorForPost, getAuthorHref } from "@/lib/authors";
import { blogPosts } from "@/lib/blog-data";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "Authors – GeoAnalyzer",
  description:
    "Meet the GeoAnalyzer editorial team behind GEO, AEO, and AI citation research.",
  openGraph: {
    title: "Authors – GeoAnalyzer",
    description:
      "Meet the GeoAnalyzer editorial team behind GEO, AEO, and AI citation research.",
    url: `${baseUrl}/authors`,
  },
  alternates: {
    canonical: `${baseUrl}/authors`,
  },
};

export default function AuthorsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Authors", url: `${baseUrl}/authors` },
  ]);

  const itemListSchema = generateItemListSchema(
    AUTHORS.map((author) => ({
      name: author.name,
      url: `${baseUrl}${getAuthorHref(author.slug)}`,
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id="schema-authors-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-authors-itemlist"
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
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="mb-12 bg-white rounded-2xl p-8 md:p-10 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Editorial Authors
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            People behind GeoAnalyzer&apos;s source-of-truth GEO, AEO, and AI
            citation content.
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTHORS.map((author) => {
            const postCount = blogPosts.filter(
              (post) => getAuthorForPost(post).slug === author.slug,
            ).length;

            return (
              <Link
                key={author.slug}
                href={getAuthorHref(author.slug)}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-1">
                  {author.name}
                </h2>
                <p className="text-sm text-blue-300 mb-4">{author.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {author.bio}
                </p>
                <p className="text-xs text-gray-400">
                  {postCount} related articles
                </p>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
