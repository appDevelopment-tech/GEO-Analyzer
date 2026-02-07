import { motion } from "framer-motion";
import RotatingText from "./RotatingText";
import TextType from "./TextType";
import { LimitedOfferBadge } from "./LimitedOfferBadge";

export const Hero = () => (
  <motion.div
    key="form"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-2xl mx-auto"
  >
    {/* Hero Section */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="text-center mb-12"
    >
      <TextType
        text={["Rank #1", "in AI Search Results"]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor
        cursorCharacter="_"
        deletingSpeed={50}
        variableSpeed={{ min: 60, max: 120 }}
        cursorBlinkDuration={0.5}
        className="text-5xl md:text-6xl font-bold text-light-grey mb-6 leading-tight bg-gradient-to-r from-apple-blue to-cyan-500 bg-clip-text text-transparent"
      />
      <div className="flex flex-col md:flex-row items-center justify-center mb-4">
        <p className="text-xl text-light-grey leading-relaxed mr-1">
          Get an evidence-based diagnostic report on your website's
        </p>
        <RotatingText
          texts={[
            "AEO score",
            "AI readiness",
            "AI visibility",
            "discoverability",
          ]}
          mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg min-w-[9.5rem]" // adjust as needed
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>
    </motion.div>
  </motion.div>
);
