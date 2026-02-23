import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import {
  AUTHORS,
  getAuthorBySlug,
  getAuthorForPost,
  getAuthorHref,
} from "@/lib/authors";
import { blogPosts } from "@/lib/blog-data";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
  generatePersonSchema,
} from "@/lib/schema-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export async function generateStaticParams() {
  return AUTHORS.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found – GeoAnalyzer",
    };
  }

  const url = `${baseUrl}${getAuthorHref(author.slug)}`;

  return {
    title: `${author.name} – GeoAnalyzer`,
    description: author.bio,
    openGraph: {
      title: `${author.name} – GeoAnalyzer`,
      description: author.bio,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = blogPosts
    .filter((post) => getAuthorForPost(post).slug === slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const authorUrl = `${baseUrl}${getAuthorHref(author.slug)}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Authors", url: `${baseUrl}/authors` },
    { name: author.name, url: authorUrl },
  ]);
  const personSchema = generatePersonSchema(author);
  const itemListSchema = generateItemListSchema(
    posts.map((post) => ({
      name: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Script
        id={`schema-author-person-${author.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id={`schema-author-breadcrumb-${author.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`schema-author-itemlist-${author.slug}`}
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
              href="/authors"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Authors
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
            href="/authors"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Authors
          </Link>
        </nav>

        <section className="mb-12 bg-white rounded-2xl p-8 md:p-10 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {author.name}
          </h1>
          <p className="text-blue-700 font-medium mb-4">{author.role}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{author.bio}</p>
          <div className="flex flex-wrap gap-2">
            {author.knowsAbout.map((topic) => (
              <span
                key={topic}
                className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            Articles by {author.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {post.description}
                </p>
                <time className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
