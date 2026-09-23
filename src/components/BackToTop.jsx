"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpIcon } from "@/components/icons";
import { useScrolledPast } from "@/hooks/useScrolledPast";

export default function BackToTop() {
  const visible = useScrolledPast(400);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
        >
          <ArrowUpIcon size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
