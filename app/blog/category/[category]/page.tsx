import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import {
  BLOG_CATEGORIES,
  getBlogCategoryHref,
  isBlogCategory,
  type BlogCategory,
} from "@/lib/blog-categories";
import { generateBreadcrumbSchema, generateItemListSchema } from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export async function generateStaticParams() {
  return Object.keys(BLOG_CATEGORIES).map((category) => ({ category }));
}

function getCategoryPosts(category: BlogCategory) {
  return blogPosts
    .filter((post) => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!isBlogCategory(category)) {
    return {
      title: "Category Not Found – GeoAnalyzer",
    };
  }

  const info = BLOG_CATEGORIES[category];
  const url = `${baseUrl}${getBlogCategoryHref(category)}`;

  return {
    title: `${info.name} – GeoAnalyzer`,
    description: info.description,
    openGraph: {
      title: `${info.name} – GeoAnalyzer`,
      description: info.description,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isBlogCategory(category)) {
    notFound();
  }

  const info = BLOG_CATEGORIES[category];
  const posts = getCategoryPosts(category);
  const categoryUrl = `${baseUrl}${getBlogCategoryHref(category)}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
    { name: info.name, url: categoryUrl },
  ]);

  const itemListSchema = generateItemListSchema(
    posts.map((post) => ({
      name: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id={`schema-category-breadcrumb-${category}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`schema-category-itemlist-${category}`}
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
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <nav className="mb-8">
          <Link
            href="/blog"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Blog
          </Link>
        </nav>

        <section className="mb-12 bg-white rounded-2xl p-8 md:p-10 shadow-xl">
          <p className="text-sm text-gray-500 mb-4">{posts.length} articles</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {info.name}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {info.description}
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors group"
            >
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-4">
                  {info.name}
                  {typeof post.score === "number" &&
                    ` · Framework: ${post.score}/10`}
                </p>
                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
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
        </section>
      </main>
    </div>
  );
}
