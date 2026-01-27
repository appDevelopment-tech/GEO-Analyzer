import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { generateBlogPostingSchema } from "@/lib/schema-data";
import { Footer } from "@/components/Footer";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geoanalyzer.netlify.app";

const blogContent: Record<
  string,
  {
    directAnswer: string;
    sections: Array<{ heading: string; content: string }>;
  }
> = {
  "what-is-geo-vs-seo": {
    directAnswer:
      "GEO (Generative Engine Optimization) focuses on making your content citable by AI chatbots and answer engines like ChatGPT, Claude, and Perplexity. SEO (Search Engine Optimization) focuses on ranking in traditional search results like Google and Bing. While both aim to increase visibility, GEO prioritizes direct answers, entity clarity, and structured data that AI systems use when choosing sources to cite.",
    sections: [
      {
        heading: "The Key Differences Between SEO and GEO/AEO",
        content:
          "Traditional SEO optimizes for search engine algorithms that rank websites based on keywords, backlinks, and technical factors. GEO optimizes for AI engines that synthesize information from multiple sources to generate direct answers. This fundamental difference means your GEO strategy needs to emphasize different signals.",
      },
      {
        heading: "Why You Need Both Strategies",
        content:
          "SEO isn't dead—Google still processes billions of searches daily. But AI is becoming the primary interface for information discovery. Users ask ChatGPT questions they used to type into Google. A comprehensive digital presence requires both SEO for traditional search and GEO for AI recommendations.",
      },
      {
        heading: "Getting Started with GEO",
        content:
          "Start by auditing your current AI recommendation readiness. Check if your content has clear direct answers, whether your entity information is consistent across the web, and if you have structured data that helps AI understand your expertise. Use GeoAnalyzer to get a comprehensive score and actionable recommendations.",
      },
    ],
  },
  "how-ai-engines-choose-citations": {
    directAnswer:
      "AI engines choose citations based on four main factors: (1) Entity clarity—can the AI understand who you are and what you offer? (2) Direct answer availability—does your content provide clear, extractable answers? (3) Trust signals—reviews, backlinks, and authority indicators. (4) Technical accessibility—can the AI crawler access and parse your content?",
    sections: [
      {
        heading: "Entity Understanding Comes First",
        content:
          "Before an AI can recommend you, it needs to understand what you offer. This is why entity clarity is the foundation of GEO. Your about page, schema markup, and consistent information across the web all contribute to entity understanding.",
      },
      {
        heading: "Direct Answers Are Preferred",
        content:
          "AI engines prioritize content that directly answers user questions. Clear headings, FAQ pages, and structured Q&A formats make it easier for AI to extract relevant information. This is why Direct Answer blocks are so effective for both users and AI.",
      },
      {
        heading: "Trust Verification Matters",
        content:
          "AI systems are cautious about recommending sources. They look for signals that verify your credibility: customer reviews, mentions in authoritative publications, backlinks from trusted domains, and security indicators like SSL certificates.",
      },
    ],
  },
  "entity-clarity-checklist": {
    directAnswer:
      "Entity clarity means AI engines can accurately understand who you are, what you offer, and why you're authoritative. This checklist covers: (1) Schema markup for your organization, (2) Consistent NAP (name, address, phone) across the web, (3) A comprehensive About page, (4) Knowledge graph presence (Wikipedia, Wikidata), (5) Social media verification.",
    sections: [
      {
        heading: "Schema Markup Fundamentals",
        content:
          "Add Organization schema to your homepage. Include your name, logo, description, URL, and contact information. For personal brands, use Person schema. For products or services, use SoftwareApplication or Product schema.",
      },
      {
        heading: "Consistent Information Everywhere",
        content:
          "Ensure your business name, address, and contact information are consistent across your website, social profiles, directories, and any third-party mentions. Inconsistent information confuses both users and AI engines.",
      },
      {
        heading: "Knowledge Graph Presence",
        content:
          "While not every brand has a Wikipedia page, you can establish knowledge graph presence through Wikidata, Crunchbase, industry directories, and authoritative mentions. These sources help AI verify your entity exists and is notable.",
      },
    ],
  },
  "geo-audit-template": {
    directAnswer:
      "A GEO audit evaluates your website's readiness for AI recommendations across five categories: entity clarity, direct answers, trust signals, competitive positioning, and technical accessibility. Use this free template to assess your current state and identify improvement opportunities.",
    sections: [
      {
        heading: "Entity Clarity Checklist",
        content:
          "- Does your homepage have Organization schema? [ ] Yes [ ] No\n- Is your About page comprehensive with team bios? [ ] Yes [ ] No\n- Is your NAP consistent across the web? [ ] Yes [ ] No\n- Do you have Wikipedia or Wikidata entries? [ ] Yes [ ] No",
      },
      {
        heading: "Direct Answers Checklist",
        content:
          "- Do key pages have Direct Answer blocks at the top? [ ] Yes [ ] No\n- Do you have an FAQ page with structured Q&A? [ ] Yes [ ] No\n- Is your heading hierarchy logical (H1 → H2 → H3)? [ ] Yes [ ] No\n- Do you use FAQPage schema? [ ] Yes [ ] No",
      },
      {
        heading: "Trust Signals Checklist",
        content:
          "- Do you have customer reviews visible on your site? [ ] Yes [ ] No\n- Do you have backlinks from authoritative domains? [ ] Yes [ ] No\n- Is your site secured with HTTPS? [ ] Yes [ ] No\n- Do you have media mentions or press coverage? [ ] Yes [ ] No",
      },
      {
        heading: "Using Your Audit Results",
        content:
          "After completing the checklist, prioritize fixes that will have the biggest impact. Entity clarity is foundational—start there. Then add direct answers. Then build trust signals. For a comprehensive automated audit, use GeoAnalyzer.",
      },
    ],
  },
  "direct-answer-block-examples": {
    directAnswer:
      "Direct Answer blocks are concise, factual paragraphs at the top of key pages that immediately answer user questions. They typically run 40-60 words, use plain language, and avoid marketing fluff. AI engines prefer this format because it's easy to extract and cite.",
    sections: [
      {
        heading: "Anatomy of a Direct Answer Block",
        content:
          "Start with an H1 that poses the core question users have. Follow with a single paragraph (40-60 words) that directly answers the question. Focus on facts, not features. Avoid superlatives like 'amazing' or 'world-class'. Be precise.",
      },
      {
        heading: "Example: Product Page",
        content:
          "H1: What is [Product Name]?\n\nAnswer: [Product Name] is a [category] that helps [target audience] [primary benefit]. Unlike [alternative], it [key differentiator]. It works by [brief mechanism] and integrates with [key platforms]. Pricing starts at [price] with a [guarantee length] money-back guarantee.",
      },
      {
        heading: "Example: Service Page",
        content:
          "H1: What services does [Company] offer?\n\nAnswer: [Company] provides [service category] for [industry]. Our core services include [service 1], [service 2], and [service 3]. We serve clients in [geographies or market segments] and specialize in [specialization]. Projects typically take [timeline] from kickoff to delivery.",
      },
      {
        heading: "Where to Use Direct Answers",
        content:
          "Place Direct Answer blocks on your homepage, key product/service pages, pricing page, about page, and FAQ pages. Each page should answer the primary question a user (or AI) would have about that page's topic.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found – GeoAnalyzer",
    };
  }

  return {
    title: `${post.title} – GeoAnalyzer`,
    description: post.description,
    openGraph: {
      title: `${post.title} – GeoAnalyzer`,
      description: post.description,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const content = blogContent[slug];

  if (!post || !content) {
    notFound();
  }

  const schema = {
    ...generateBlogPostingSchema({
      title: post.title,
      description: post.description,
      datePublished: post.date,
      slug,
    }),
    "@context": "https://schema.org",
  };

  return (
    <>
      <Script
        id={`schema-blog-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
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
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/blog"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <time className="text-gray-400 text-sm">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {post.description}
            </p>
          </header>

          {/* Direct Answer Block */}
          <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Direct Answer
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.directAnswer}
            </p>
          </section>

          {/* Content Sections */}
          <section className="prose prose-invert max-w-none">
            {content.sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {section.heading}
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </section>

          {/* Related Posts */}
          <section className="mt-16 pt-16 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter((p) => p.slug !== slug && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 text-center bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Check your GEO score
            </h2>
            <p className="text-gray-400 mb-8">
              See how well your website is optimized for AI recommendations.
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Analyze My Site
            </a>
          </section>
        </main>

        <Footer />
      </article>
    </>
  );
}
