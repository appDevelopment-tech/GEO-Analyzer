import type { MetadataRoute } from "next";
import { AUTHORS, getAuthorHref } from "@/lib/authors";
import { blogPosts } from "@/lib/blog-data";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { comparisonPages, getComparisonHref } from "@/lib/comparison-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = Object.keys(BLOG_CATEGORIES).map(
    (category) => ({
      url: `${baseUrl}/blog/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }),
  );

  const authorPages: MetadataRoute.Sitemap = AUTHORS.map((author) => ({
    url: `${baseUrl}${getAuthorHref(author.slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const comparisonSubPages: MetadataRoute.Sitemap = comparisonPages.map(
    (page) => ({
      url: `${baseUrl}${getComparisonHref(page.slug)}`,
      lastModified: new Date(page.date),
      changeFrequency: "monthly" as const,
      priority: 0.58,
    }),
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...authorPages,
    ...comparisonSubPages,
    ...blogPages,
  ];
}
