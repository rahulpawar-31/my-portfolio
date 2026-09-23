"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        const increment = prev < 60 ? 8 : prev < 85 ? 4 : 1.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
        >
          <motion.div
            {...fadeInUp(0.1, 0.5)}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Rahul<span className="text-yellow-400">.</span>dev
            </h1>
            <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">
              Loading portfolio
            </p>
          </motion.div>

          <motion.div
            className="w-48 h-0.5 bg-zinc-800 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          <motion.p
            className="text-zinc-600 text-xs mt-3 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
