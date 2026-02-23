const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geo-analyzer.com";

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GeoAnalyzer",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    "GeoAnalyzer helps websites optimize for AI recommendation engines through GEO audits and actionable insights.",
  sameAs: [
    // Add social links when available
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@geoanalyzer.app",
  },
};

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GeoAnalyzer",
  url: baseUrl,
  description:
    "Analyze your website's readiness for AI recommendations and generative engine optimization.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/api/analyze?url={search_term_string}`,
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      valueRequired: true,
      valueName: "search_term_string",
    },
  },
};

export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateItemListSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function generatePersonSchema(person: {
  name: string;
  slug: string;
  role: string;
  bio: string;
  knowsAbout: string[];
  sameAs?: string[];
}) {
  const url = `${baseUrl}/authors/${person.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": url,
    name: person.name,
    url,
    description: person.bio,
    jobTitle: person.role,
    knowsAbout: person.knowsAbout,
    sameAs: person.sameAs || [],
    worksFor: {
      "@type": "Organization",
      name: "GeoAnalyzer",
      url: baseUrl,
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GeoAnalyzer",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      name: "Full GEO Report",
      price: "19.50",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateBlogPostingSchema(post: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
  author?: {
    slug: string;
    name: string;
    role?: string;
    sameAs?: string[];
    knowsAbout?: string[];
  };
}) {
  const url = `${baseUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${baseUrl}/og-image.png`,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: post.author
      ? {
          "@type": "Person",
          "@id": `${baseUrl}/authors/${post.author.slug}`,
          name: post.author.name,
          url: `${baseUrl}/authors/${post.author.slug}`,
          jobTitle: post.author.role,
          knowsAbout: post.author.knowsAbout || [],
          sameAs: post.author.sameAs || [],
        }
      : {
          "@type": "Organization",
          name: "GeoAnalyzer",
        },
    publisher: {
      "@type": "Organization",
      name: "GeoAnalyzer",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}
