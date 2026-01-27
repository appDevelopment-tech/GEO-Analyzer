import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geoanalyzer.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GeoAnalyzer – GEO/AI/AEO Visibility Audit Tool",
    template: "%s – GeoAnalyzer",
  },
  description:
    "Analyze your website's readiness for AI recommendations. Get actionable insights on entity clarity, direct answers, trust signals, and competitive positioning for generative engines.",
  keywords: [
    "GEO",
    "Generative Engine Optimization",
    "AI SEO",
    "AI visibility",
    "entity optimization",
    "AI citation",
    "answer engine optimization",
    "AEO",
    "AI recommendation readiness",
    "structured data for AI",
    "ChatGPT SEO",
    "Perplexity AI optimization",
    "Claude AI SEO",
    "AI trust signals",
    "competitive positioning for AI",
    "technical accessibility for AI",
    "AI content optimization",
    "AI ranking factors",
  ],
  authors: [{ name: "GeoAnalyzer" }],
  creator: "GeoAnalyzer",
  publisher: "GeoAnalyzer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "GeoAnalyzer – GEO/AEO/AI Visibility Audit Tool",
    description:
      "Analyze your website's readiness for AI recommendations. Get actionable insights on entity clarity, direct answers, trust signals, and competitive positioning.",
    siteName: "GeoAnalyzer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GeoAnalyzer - AI Recommendation Readiness Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoAnalyzer – GEO/AI Visibility Audit Tool",
    description:
      "Analyze your website's readiness for AI recommendations. Get actionable insights on entity clarity, direct answers, trust signals, and competitive positioning.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
