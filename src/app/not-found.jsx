"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInScale, fadeInUp } from "@/lib/motion";
import { primaryButton, secondaryButton } from "@/lib/styles";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-black">

      <motion.h1
        className="text-[120px] md:text-[180px] font-bold leading-none text-zinc-100 dark:text-zinc-900 select-none"
        {...fadeInScale()}
      >
        404
      </motion.h1>

      <motion.div
        className="-mt-8 md:-mt-12"
        {...fadeInUp(0.3)}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          Page not found
        </h2>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Looks like this page doesn&apos;t exist or was moved. Let&apos;s get you
          back on track.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex gap-4"
        {...fadeInUp(0.5)}
      >
        <Link
          href="/"
          className={`px-6 py-3 text-sm font-medium ${primaryButton}`}
        >
          Go home
        </Link>
        <Link
          href="/#contact"
          className={`px-6 py-3 text-sm font-medium ${secondaryButton}`}
        >
          Contact me
        </Link>
      </motion.div>

    </div>
  );
}
