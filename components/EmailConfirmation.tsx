import { motion } from "framer-motion";

export const EmailConfirmation = () => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 2, duration: 0.5 }}
    className="mt-8 text-center"
  >
    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-full">
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <p className="text-sm font-medium text-green-900">
        Full report sent to your email
      </p>
    </div>
  </motion.div>
);
