"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-black">

      <motion.h1
        className="text-[120px] md:text-[180px] font-bold leading-none text-zinc-100 dark:text-zinc-900 select-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.div
        className="-mt-8 md:-mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          Page not found
        </h2>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Looks like this page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Link
          href="/"
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/#contact"
          className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Contact me
        </Link>
      </motion.div>

    </div>
  );
}
