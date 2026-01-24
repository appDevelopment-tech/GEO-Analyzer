import { motion } from "framer-motion";

export const Features = () => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.5 }}
    className="mt-16 grid md:grid-cols-3 gap-8 color-light-grey"
  >
    {[
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        title: "No Guesswork",
        description:
          "Every score links back to real content on your site. See exactly what AI sees.",
      },
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
        title: "AI-Powered",
        description:
          "We use the same tech that powers ChatGPT (and more) to analyze how discoverable you really are.",
      },
      {
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
        title: "Fix It This Week",
        description:
          "Walk away with a prioritized action plan — not a 47-page PDF you'll never read.",
      },
    ].map((feature, index) => (
      <div key={index} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-apple-blue/10 text-light-grey mb-4">
          {feature.icon}
        </div>
        <h3 className="font-semibold text-light-grey mb-2">{feature.title}</h3>
        <p className="text-sm text-gray-300">{feature.description}</p>
      </div>
    ))}
  </motion.div>
);
