import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Status – GeoAnalyzer",
  description: "Payment status page for GeoAnalyzer checkout.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
