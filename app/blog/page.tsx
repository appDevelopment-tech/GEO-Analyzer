import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { blogPosts } from "@/lib/blog-data";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/schema-data";

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

const categories = {
  fundamentals: { name: "GEO Fundamentals", color: "purple" },
  audits: { name: "Audits & Templates", color: "green" },
  "case-studies": { name: "Case Studies", color: "blue" },
};

const categoryColors = {
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  green: "bg-green-500/20 text-green-400 border-green-500/50",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GEO Blog
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Learn how to optimize your website for AI recommendation engines.
            Practical guides, templates, and case studies on Generative Engine
            Optimization.
          </p>
        </section>

        {/* Blog Posts by Category */}
        {Object.entries(groupedPosts).map(([category, posts]) => {
          const catInfo = categories[category as keyof typeof categories];
          const colorClass =
            categoryColors[catInfo.color as keyof typeof categoryColors];
          const sortedPosts = [...posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full bg-${catInfo.color}-500`}
                />
                {catInfo.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors group"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${colorClass}`}
                        >
                          {catInfo.name}
                        </span>
                        {typeof post.score === "number" && (
                          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full border border-yellow-500/50 text-yellow-300 bg-yellow-500/10">
                            Framework: {post.score}/10
                          </span>
                        )}
                      </div>
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
