import { blogPosts } from "@/lib/blog-data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

function buildLlmsTxt(): string {
  const sortedPosts = [...blogPosts].sort((a, b) => {
    const scoreDelta = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDelta !== 0) return scoreDelta;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const topPosts = sortedPosts.slice(0, 60);

  const lines = [
    "# GeoAnalyzer",
    "",
    "> GeoAnalyzer is a GEO/AEO diagnostic and education platform for AI-search visibility.",
    "",
    "## Canonical",
    `- ${baseUrl}`,
    `- ${baseUrl}/blog`,
    `- ${baseUrl}/docs`,
    `- ${baseUrl}/faq`,
    "",
    "## Discovery",
    `- Sitemap: ${baseUrl}/sitemap.xml`,
    `- Robots: ${baseUrl}/robots.txt`,
    "",
    "## Priority Articles",
    ...topPosts.map(
      (post) =>
        `- [${post.title}](${baseUrl}/blog/${post.slug})` +
        ` — ${post.description}`,
    ),
    "",
    "## Contact",
    "- Email: contact@geoanalyzer.app",
  ];

  return `${lines.join("\n")}\n`;
}

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
