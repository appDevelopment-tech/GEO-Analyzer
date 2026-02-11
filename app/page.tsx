"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Form } from "@/components/Form";
import { Features } from "@/components/Features";
import { Info } from "@/components/Info";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAnalyzing(true);

    const t0 = Date.now();
    console.log("[Analyze] Starting analysis", { url, email: email.replace(/(.{3}).*(@.*)/, "$1***$2") });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });

      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[Analyze] Response received in ${elapsed}s — status ${response.status}`);

      // Netlify 502/504 returns HTML, not JSON — handle gracefully
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const raw = await response.text();
        console.error("[Analyze] Non-JSON response:", { status: response.status, contentType, bodyPreview: raw.slice(0, 500) });
        throw new Error(
          response.status === 502
            ? `Server timeout after ${elapsed}s — the site may be slow to crawl. Please try again.`
            : response.status === 504
              ? `Gateway timeout after ${elapsed}s. Please try again in a moment.`
              : `Unexpected response (HTTP ${response.status}). Please try again.`
        );
      }

      const data = await response.json();
      console.log("[Analyze] Parsed response:", {
        success: data.success,
        report_id: data.report_id,
        step: data._debug_step,
        error: data.error,
      });

      if (!response.ok) {
        throw new Error(data.error || `Analysis failed (HTTP ${response.status})`);
      }

      // Pass the URL so the report page can trigger the worker
      const analysisUrl = encodeURIComponent(data.url || url);
      router.push(`/report/${data.report_id}?url=${analysisUrl}`);
    } catch (err: any) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.error(`[Analyze] Failed after ${elapsed}s:`, err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto"></div>
      <AnimatePresence mode="sync">
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Hero />
          <Form
            url={url}
            setUrl={setUrl}
            isAnalyzing={isAnalyzing}
            error={error}
            handleAnalyze={handleAnalyze}
            email={email}
            setEmail={setEmail}
          />
          <Features />
          <div className="flex justify-center pt-4">
            <a
              href="https://www.producthunt.com/products/geoanalyzer?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-geoanalyzer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt='GeoAnalyzer - Find out if AI search can "see" your website | Product Hunt'
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1077960&theme=light&t=1770834455366"
              />
            </a>
          </div>
          <a
            href="https://indiehunt.io/project/geo-aeo-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-transparent h-0 overflow-hidden block"
            aria-hidden="true"
          >
            https://indiehunt.io/project/geo-aeo-analyzer
          </a>
          <Info />
        </motion.div>
        <Footer />
      </AnimatePresence>
    </main>
  );
}
