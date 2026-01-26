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
        body: JSON.stringify({ url }),
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
      <AnimatePresence mode="wait">
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
          <Info />
        </motion.div>
        <Footer />
      </AnimatePresence>
    </main>
  );
}
