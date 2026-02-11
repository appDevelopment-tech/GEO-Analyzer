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

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      // Navigate to the report page if successful
      router.push(`/report/${data.report_id}`);
    } catch (err: any) {
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
          <Info />
        </motion.div>
        <Footer />
      </AnimatePresence>
    </main>
  );
}
