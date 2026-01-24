import { motion } from "framer-motion";

export const Header = () => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="py-6 px-4"
  >
    <div className="ml-0 border-b border-apple-border pb-4">
      <h1 className="text-2xl font-bold text-apple-light text-center">
        GEO Analyzer
      </h1>
    </div>
  </motion.header>
);
