"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ResultContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "error">("success");

  useEffect(() => {
    if (searchParams.get("error")) {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-apple-light px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center animated-glow">
        <div
          className={`mb-6 px-4 py-2 rounded-full text-lg font-semibold shadow-md ${
            status === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {status === "success" ? "Payment Successful" : "Payment Error"}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-apple-gray mb-4 text-center">
          {status === "success"
            ? "Thank you for your purchase!"
            : "Something went wrong"}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          {status === "success"
            ? "Your payment was received. Your full GEO report will be sent to your email shortly."
            : "We couldn't process your payment. Please try again or contact support."}
        </p>
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
