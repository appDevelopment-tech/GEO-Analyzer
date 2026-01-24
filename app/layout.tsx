import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Analyzer - AI Recommendation Readiness",
  description: "Discover if AI can confidently recommend your website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
