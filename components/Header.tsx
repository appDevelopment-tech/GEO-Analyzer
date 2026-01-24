import { motion } from "framer-motion";
import Image from "next/image";

export const Header = () => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="py-6 px-4"
  >
    <div className="flex ml-0 border-b border-apple-border pb-4 gap-2 justify-center items-center">
      <Image
        src="/images/GEO_dark.png"
        alt="GEO Analyzer Logo"
        width={40}
        height={40}
        className="shadow-md"
      />
      <h1 className="text-2xl font-bold text-apple-light">GEO Analyzer</h1>
    </div>
  </motion.header>
);
