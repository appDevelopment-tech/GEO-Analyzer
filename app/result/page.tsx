"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ResultContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading",
  );
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }
    // Fetch session status from API
    fetch(`/api/stripe-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.payment_status === "paid") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-apple-light px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animated-glow">
        {status === "loading" ? (
          <div className="mb-6 px-4 py-2 rounded-full text-lg font-semibold shadow-md bg-gray-100 text-gray-700 border border-gray-300 animate-pulse">
            Checking payment status...
          </div>
        ) : (
          <div
            className={`mb-6 px-4 py-2 rounded-full text-lg font-semibold shadow-md ${
              status === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {status === "success" ? "Payment Successful" : "Payment Error"}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-apple-gray mb-4 text-center">
          {status === "success"
            ? "Thank you for your purchase!"
            : status === "loading"
              ? "Checking your payment..."
              : "Something went wrong"}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          {status === "success"
            ? "Your payment was received. Your full GEO report will be sent to your email shortly."
            : status === "loading"
              ? "Please wait while we verify your payment."
              : "We couldn't process your payment. Please try again or contact support."}
        </p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          type="button"
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-apple-blue to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to Home
        </motion.button>
        {/* Add your cute GIFs here! */}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
