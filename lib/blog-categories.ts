import type { BlogPost } from "@/lib/blog-data";

export type BlogCategory = BlogPost["category"];

type CategoryColor = "purple" | "green" | "blue";

export const BLOG_CATEGORIES: Record<
  BlogCategory,
  {
    name: string;
    description: string;
    color: CategoryColor;
  }
> = {
  fundamentals: {
    name: "GEO Fundamentals",
    description:
      "Core concepts, definitions, and strategic models for GEO/AEO/SEO.",
    color: "purple",
  },
  audits: {
    name: "Audits & Templates",
    description:
      "Execution frameworks, checklists, templates, and technical implementation playbooks.",
    color: "green",
  },
  "case-studies": {
    name: "Case Studies",
    description:
      "Real-world experiments, comparative analysis, and practical outcomes from applied GEO work.",
    color: "blue",
  },
};

export const CATEGORY_COLOR_CLASSES: Record<CategoryColor, string> = {
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  green: "bg-green-500/20 text-green-400 border-green-500/50",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

export function isBlogCategory(value: string): value is BlogCategory {
  return Object.prototype.hasOwnProperty.call(BLOG_CATEGORIES, value);
}

export function getBlogCategoryHref(category: BlogCategory): string {
  return `/blog/category/${category}`;
}
