"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = ["a Developer 💻", "a Next.js Learner 🚀", "a Problem Solver 🧠", "a Builder ⚡"];

const stats = [
  { value: "4+", label: "Projects Built" },
  { value: "Full Stack", label: "Next.js + Node.js" },
  { value: "Open", label: "To Internship" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag, avoids SSR/client hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fullText = roles[currentRole];
    if (!isDeleting && displayed.length < fullText.length) {
      const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!isDeleting && displayed.length === fullText.length) {
      const t = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length - 1)), 40);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayed.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- advances the typewriter state machine once a word fully deletes
      setIsDeleting(false);
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }
  }, [displayed, isDeleting, currentRole, mounted]);

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[88vh] px-6 overflow-hidden">
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 font-medium shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Open to work
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Hi, I&apos;m{" "}
        <span className="relative inline-block">
          <span className="text-amber-700 dark:text-yellow-400">Rahul</span>
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400/40 rounded-full" />
        </span>{" "}
        👋
      </motion.h1>

      <motion.div
        className="mt-5 h-10 flex items-center justify-center text-2xl md:text-3xl font-semibold text-zinc-600 dark:text-zinc-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {mounted ? (
          <>
            <span className="text-amber-700 dark:text-yellow-400 mr-2">I&apos;m</span>
            <span>{displayed}</span>
            <span className="ml-1 inline-block w-0.5 h-7 bg-yellow-400 animate-pulse" />
          </>
        ) : (
          <span className="opacity-0">I&apos;m a Developer 💻</span>
        )}
      </motion.div>

      <motion.p
        className="mt-6 text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        I build clean, fast and functional web applications using modern technologies.
        Passionate about great user experiences.
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm min-w-[100px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          >
            <span className="text-lg font-bold text-amber-700 dark:text-yellow-400">{stat.value}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <button
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          className="px-7 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all hover:scale-105 shadow-lg"
        >
          View Projects
        </button>
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="px-7 py-3 border border-zinc-300 dark:border-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105"
        >
          Contact Me
        </button>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-7 py-3 border border-zinc-300 dark:border-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105">
          Resume ↓
        </a>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-zinc-400"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
