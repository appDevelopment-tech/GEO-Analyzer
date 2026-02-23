import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { blogPosts } from "@/lib/blog-data";
import {
  BLOG_CATEGORIES,
  getBlogCategoryHref,
  type BlogCategory,
} from "@/lib/blog-categories";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const metadata: Metadata = {
  title: "Blog – GeoAnalyzer",
  description:
    "Learn about Generative Engine Optimization (GEO), AEO, AI citation strategies, and how to improve your website's visibility in AI search results.",
  openGraph: {
    title: "Blog – GeoAnalyzer",
    description:
      "Learn about Generative Engine Optimization (GEO), AEO, AI citation strategies, and how to improve your website's visibility in AI search results.",
    url: `${baseUrl}/blog`,
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

export default function BlogPage() {
  const groupedPosts = blogPosts.reduce(
    (acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = [];
      }
      acc[post.category].push(post);
      return acc;
    },
    {} as Record<string, typeof blogPosts>,
  );
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
  ]);
  const itemListSchema = generateItemListSchema(
    latestPosts.map((post) => ({
      name: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id="schema-blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-blog-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
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
              href="/faq"
              className="text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/compare"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Compare
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

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Page Header */}
        <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                GEO Blog
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Learn how to optimize your website for AI recommendation
                engines. Practical guides, templates, and case studies on
                Generative Engine Optimization.
              </p>
            </div>
            <a
              href="/rss.xml"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors text-sm font-medium shrink-0"
            >
              Subscribe via RSS
            </a>
          </div>
        </section>

        {/* Blog Posts by Category */}
        {Object.entries(groupedPosts).map(([rawCategory, posts]) => {
          const category = rawCategory as BlogCategory;
          const catInfo = BLOG_CATEGORIES[category];
          const sortedPosts = [...posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full bg-${catInfo.color}-500`}
                />
                <Link
                  href={getBlogCategoryHref(category)}
                  className="hover:text-blue-300 transition-colors"
                >
                  {catInfo.name}
                </Link>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors group"
                  >
                    <div className="p-6">
                      <p className="text-xs text-gray-400 mb-4">
                        {catInfo.name}
                        {typeof post.score === "number" &&
                          ` · Framework: ${post.score}/10`}
                      </p>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {post.description}
                      </p>
                      <time className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="text-center bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to check your GEO score?
          </h2>
          <p className="text-gray-400 mb-8">
            Get actionable insights on your website's AI recommendation
            readiness.
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
