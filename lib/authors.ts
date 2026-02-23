import type { BlogPost } from "@/lib/blog-data";

export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  knowsAbout: string[];
  sameAs: string[];
}

export const AUTHORS: AuthorProfile[] = [
  {
    slug: "max-petrusenko",
    name: "Max Petrusenko",
    role: "GEO Systems Lead",
    bio: "Builds technical GEO systems across crawlability, schema architecture, and answer-ready content design.",
    knowsAbout: [
      "Generative Engine Optimization",
      "Technical SEO",
      "Structured Data",
      "AI Crawlers",
      "Citation Tracking",
    ],
    sameAs: [
      "https://www.linkedin.com",
      "https://x.com",
    ],
  },
  {
    slug: "nina-volkova",
    name: "Nina Volkova",
    role: "Content Strategy Analyst",
    bio: "Focuses on source-of-truth editorial systems, direct-answer writing, and citation-oriented content operations.",
    knowsAbout: [
      "Answer Engine Optimization",
      "Editorial Systems",
      "Topical Authority",
      "FAQ Strategy",
      "Zero-Click Content",
    ],
    sameAs: [
      "https://www.linkedin.com",
      "https://x.com",
    ],
  },
  {
    slug: "igor-koval",
    name: "Igor Koval",
    role: "AI Search Researcher",
    bio: "Runs comparative tests across ChatGPT, Perplexity, Claude, and Google AI Overviews to isolate citation drivers.",
    knowsAbout: [
      "AI Search Experiments",
      "Prompt Measurement",
      "Platform Citation Behavior",
      "GEO Audits",
      "Competitive Analysis",
    ],
    sameAs: [
      "https://www.linkedin.com",
      "https://x.com",
    ],
  },
];

const CATEGORY_AUTHOR_POOLS: Record<BlogPost["category"], string[]> = {
  fundamentals: ["max-petrusenko", "nina-volkova"],
  audits: ["max-petrusenko", "igor-koval"],
  "case-studies": ["nina-volkova", "igor-koval"],
};

const authorBySlug = AUTHORS.reduce<Record<string, AuthorProfile>>(
  (acc, author) => {
    acc[author.slug] = author;
    return acc;
  },
  {},
);

function deterministicIndex(input: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 2147483647;
  }
  return hash % modulo;
}

export function getAuthorHref(authorSlug: string): string {
  return `/authors/${authorSlug}`;
}

export function getAuthorBySlug(authorSlug: string): AuthorProfile | undefined {
  return authorBySlug[authorSlug];
}

export function getAuthorForPost(
  post: Pick<BlogPost, "slug" | "category">,
): AuthorProfile {
  const pool = CATEGORY_AUTHOR_POOLS[post.category];
  const selectedSlug = pool[deterministicIndex(post.slug, pool.length)];
  return authorBySlug[selectedSlug];
}
