import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    question: "What is GEO/AEO?",
    answer: (
      <>
        <span className="block mb-2 text-gray-800 font-semibold">
          Generative Engine Optimization (GEO/AEO) is how you get your business
          recommended by AI tools like ChatGPT, Perplexity, and Claude.
        </span>
        <span className="block mb-2 text-gray-700">
          Google made you optimize for search. AI is making you optimize for
          answers.
        </span>
        <span className="block mb-2 text-gray-700">
          When someone asks, <i>"What's the best CRM for small teams?"</i> —
          GEO/AEO determines whether AI mentions you or your competitor.
        </span>
        <span className="block mb-2 text-gray-700">
          AI doesn't return 10 blue links. It returns one answer — maybe two. If
          you're not in that answer, you don't exist.
        </span>
        <span className="block mb-2 text-gray-700">
          Traditional SEO won't save you here. Google rankings don't transfer to
          AI recommendations. Different game, different rules.
        </span>
      </>
    ),
  },
  {
    question: "Why does GEO/AEO matter now?",
    answer: (
      <>
        <span className="block mb-2 text-gray-700">
          <b>Zero-click is the new normal.</b> AI gives users the answer
          directly. No click needed. If you're not the source it cites, you miss
          the moment entirely.
        </span>
        <span className="block mb-2 text-gray-700">
          <b>Your competitors are invisible too — for now.</b> Most businesses
          haven't figured this out yet. Early movers win the recommendation slot
          while everyone else fights for page-one scraps.
        </span>
        <span className="block mb-2 text-gray-700">
          <b>AI trust signals are different.</b> Backlinks helped you rank on
          Google. AI cares about structured data, authoritative content, clear
          entity relationships, and citation-ready formatting.
        </span>
      </>
    ),
  },
  {
    question: "How does the GEO/AEO report help me?",
    answer: (
      <>
        <span className="block mb-2 text-gray-700">
          We scan your site the same way AI does — then show you exactly what's
          helping (and hurting) your chances of getting recommended.
        </span>
        <ul className="mb-2 list-disc pl-6 text-gray-700">
          <li>Your AI visibility score across key ranking factors</li>
          <li>Which pages are citation-ready (and which aren't)</li>
          <li>Gaps in structured data AI relies on</li>
          <li>A prioritized Week 1 fix list — not a 50-page audit</li>
        </ul>
        <span className="block mb-2 text-gray-700">
          No guesswork. Every score links back to real content on your pages.
        </span>
      </>
    ),
  },
  {
    question: "How is GEO/AEO different from SEO?",
    answer: (
      <>
        <span className="block mb-2 text-gray-700">
          SEO is about ranking on Google. GEO/AEO is about being the answer AI
          recommends. The signals, data, and strategies are different — and so
          are the rewards.
        </span>
      </>
    ),
  },
  {
    question: "What kinds of questions does AI answer?",
    answer: (
      <>
        <span className="block mb-2 text-gray-700">
          AI answers real-world, intent-driven questions like:
        </span>
        <ul className="mb-2 list-disc pl-6 text-gray-700">
          <li>"What's the best Italian restaurant near me?"</li>
          <li>"Which project management tool should I use?"</li>
          <li>"Who's the top immigration lawyer in Miami?"</li>
        </ul>
        <span className="block mb-2 text-gray-700">
          If you're not in the answer, you don't exist to the user.
        </span>
      </>
    ),
  },
  {
    question: "How much does it cost?",
    answer: (
      <>
        <span className="block mb-2 text-gray-700">
          You get a short GEO/AEO analysis report for free — no strings
          attached. This gives you a quick snapshot of your site's AI visibility
          and top issues.
        </span>
        <span className="block mb-2 text-gray-700">
          If you want a full, detailed report with prioritized action items and
          a week-one fix plan, you can purchase it for a one-time fee ($19.50).
          That’s less than the price of two cups of coffee—an easy investment
          for a big boost in AI visibility. The full report shows exactly what
          to fix and why, so you can win more AI recommendations right away.
        </span>
      </>
    ),
  },
];

export function Info() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12 mb-16 bg-white rounded-3xl shadow-xl p-8 md:p-10 max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-apple-gray mb-6 text-center">
        Frequently asked questions
      </h2>
      <div>
        {sections.map((section, idx) => (
          <div key={section.question} className="mb-6">
            <button
              className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none ${openIndex === idx ? "bg-blue-50 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
              onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{section.question}</span>
              <span className="ml-4 text-2xl select-none" aria-hidden="true">
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4 pt-2"
                >
                  {section.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
