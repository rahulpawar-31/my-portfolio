"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  fadeInScale,
  fadeInUp,
  fadeInX,
} from "@/lib/motion";
import { primaryButton, secondaryButton, tagPill } from "@/lib/styles";

const techStack = [
  "Next.js", "React", "TypeScript", "Node.js",
  "Express", "MongoDB", "PostgreSQL", "Tailwind CSS",
  "Prisma", "Framer Motion",
];

const timeline = [
  {
    year: "Year 1",
    title: "Started My Coding Journey",
    desc: "Picked up HTML, CSS and JavaScript from scratch. Built my first static websites and fell in love with seeing ideas come to life on screen.",
  },
  {
    year: "Year 2",
    title: "Went Full Stack",
    desc: "Learned Node.js, Express and MongoDB. Built my first backend API — a Library Management System with full CRUD, MVC architecture and cron jobs.",
  },
  {
    year: "Year 3",
    title: "Mastered Modern Web Dev",
    desc: "Dived deep into Next.js, TypeScript, PostgreSQL and Prisma. Built and deployed this portfolio with a real database, email integration and CI/CD pipeline.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-20 px-6">
      <div className="max-w-2xl mx-auto">

        <motion.div
          {...fadeInUp()}
        >
          <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-8" />
          <h1 className="text-4xl font-bold mb-2">About Me</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Fresh Graduate · Full Stack Developer · India 🇮🇳</p>
        </motion.div>

        <motion.div
          {...fadeInUp(0.15)}
          className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed"
        >
          <p>
            Hi, I&apos;m <span className="font-semibold text-zinc-900 dark:text-white">Rahul</span> — a
            full stack developer from India with 3 years of hands-on coding experience.
            I started with a simple curiosity and grew it into a real passion for building
            things that people actually use.
          </p>
          <p>
            What drives me is simple —{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              I love to build products that solve real problems and are used by many people.
            </span>{" "}
            Every project I build teaches me something new and pushes me closer to that goal.
          </p>
          <p>
            I&apos;m a fresh graduate actively looking for a{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              full-time full stack developer role
            </span>{" "}
            where I can contribute from day one, keep learning, and build products that make an impact.
          </p>
        </motion.div>

        <motion.div
          {...fadeInUp(0.25)}
          className="mt-10 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">What I bring</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🚀", title: "4+ Projects", desc: "Built and deployed real apps" },
              { icon: "🔧", title: "Full Stack", desc: "Frontend + Backend + DB" },
              { icon: "📦", title: "Ship Ready", desc: "CI/CD, Vercel, Neon DB" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-1">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-zinc-900 dark:text-white text-sm">{item.title}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeInUp(0.35)}
          className="mt-10"
        >
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t, i) => (
              <motion.span
                key={t}
                {...fadeInScale(0.4 + i * 0.04, 0.3)}
                className={`text-sm px-3 py-1.5 ${tagPill}`}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeInUp(0.5)}
          className="mt-10"
        >
          <h2 className="text-2xl font-semibold mb-6">My Journey</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                {...fadeInX(-20, 0.55 + i * 0.1, 0.5)}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 mt-1 mb-1" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-mono text-yellow-500 dark:text-yellow-400">{item.year}</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mt-0.5">{item.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeInUp(0.75)}
          className="mt-4 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-400/20 bg-yellow-50 dark:bg-yellow-400/5"
        >
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            👋 Currently open to full-time opportunities
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Looking for a full stack role where I can build real products and grow fast.
          </p>
          <div className="flex gap-3">
            <Link
              href="/#contact"
              className={`px-5 py-2 text-sm font-medium ${primaryButton}`}
            >
              Get in touch
            </Link>
            <Link
              href="/#projects"
              className={`px-5 py-2 text-sm font-medium ${secondaryButton}`}
            >
              View my work
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
