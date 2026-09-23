const { PrismaClient } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");
require("dotenv").config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const projects = [
    {
      slug: "portfolio-website",
      name: "Portfolio Website",
      desc: "A production-ready developer portfolio with database integration, email delivery and CI/CD — built to get hired.",
      longDesc: "Most developer portfolios are just static pages. I built mine differently — with a real PostgreSQL database (Neon), a working contact form that saves messages and sends emails via Resend, dark mode, animations and a full CI/CD pipeline. The goal was to build something that demonstrates full stack skills, not just frontend design.",
      tech: ["Next.js", "JavaScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Framer Motion", "Resend"],
      githubUrl: "https://github.com/rahulpawar-31/my-portfolio",
      liveUrl: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
      gradient: "from-yellow-400 to-orange-400",
      features: [
        "Contact form saves messages to Neon PostgreSQL database",
        "Email delivery via Resend API",
        "Dark/light mode with next-themes",
        "Typewriter animation with hydration fix",
        "Sticky navbar with scroll blur and active section highlight",
        "SSG for all project pages — instant load",
        "Branch protection with PR workflow on GitHub",
        "Auto-deploy on Vercel with postinstall prisma generate",
      ],
      challenges: "The biggest challenge was Prisma 7 — it had major breaking changes from older versions. The PrismaClient needed a Neon driver adapter, the schema lost the url field, and generateStaticParams crashed at build time because it tried to query the DB before the server started.",
    },
    {
      slug: "library-management-system",
      name: "Library Management System",
      desc: "A production-grade REST API backend for managing books, members and borrowing — built with Node.js, Express and MongoDB.",
      longDesc: "Libraries struggle with manual tracking of books, members and overdue returns. I built a complete backend API to automate this — handling everything from book inventory to member management, borrowing and returning, and automated overdue reminders.",
      tech: ["Node.js", "Express", "MongoDB", "Mongoose", "REST API", "Cron Jobs", "MVC"],
      githubUrl: "https://github.com/rahulpawar-31/library-management-system",
      liveUrl: null,
      gradient: "from-green-400 to-teal-400",
      features: [
        "Full CRUD for books, members and borrowing records",
        "Borrow and return endpoints with availability checks",
        "Automated overdue reminder cron job runs daily",
        "MVC architecture — models, controllers, routes separated",
        "Mongoose models with validation",
        "Centralized error handling middleware",
      ],
      challenges: "Designing the MVC folder structure before writing a single line of code was the key decision that made this project work. Early on I tried writing everything in one file — it became unmanageable fast.",
    },
    {
      slug: "payload-ecommerce",
      name: "Payload Ecommerce",
      desc: "A full-stack e-commerce platform built with Payload CMS and Next.js — featuring product management, cart, and a live storefront.",
      longDesc: "A production e-commerce platform that uses Payload CMS as the headless backend for product and order management, paired with a Next.js storefront. The project covers the full commerce flow — browsing products, managing a cart, and checking out — with content managed through Payload's admin panel.",
      tech: ["Payload CMS", "Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Dodo Payments"],
      githubUrl: "https://github.com/rahulpawar-31/payload-ecommerce",
      liveUrl: "https://payload-ecommerce-eight.vercel.app",
      gradient: "from-indigo-400 to-purple-400",
      features: [
        "Payload CMS admin panel for product and order management",
        "Next.js storefront with dynamic product pages",
        "Cart functionality with state management",
        "Full TypeScript across frontend and CMS",
        "Deployed on Vercel with live demo",
      ],
      challenges: "Integrating Payload CMS as a headless backend with a separate Next.js frontend required careful API design. Getting type safety across both layers without duplication was the biggest architectural challenge.",
    },
    {
      slug: "personal-ai",
      name: "Personal AI (DevOS)",
      desc: "DevOS — a personal AI command center that automates Gmail, Calendar, Notion, GitHub, Trello and Slack, powered by Gemini and Groq Llama.",
      longDesc: "An autonomous agent I built to manage my own workflow — Gmail, Google Calendar, Notion, GitHub, Trello and Slack, powered by Gemini 2.5 Flash and Groq Llama 3.3 (free-tier APIs, no credit card required). It runs a morning digest of 6 sub-agents in parallel, triages email with priority scoring and draft replies, protects focus blocks on the calendar, syncs tasks across Notion/GitHub/Trello, and routes natural-language commands through an intent-classification chat layer backed by a persistent memory store.",
      tech: ["React 19", "Vite", "Node.js", "Express 5", "Gemini API", "Groq", "LLM APIs", "REST API"],
      githubUrl: "https://github.com/rahulpawar-31/Personal-AI",
      liveUrl: "https://personal-ai-blue.vercel.app",
      gradient: "from-rose-400 to-orange-400",
      features: [
        "Morning digest — 6 sub-agents run in parallel and report to Slack",
        "Email triage with P1/P2/P3 priority scoring and one-tap draft replies",
        "Calendar intelligence — conflict detection, focus-block protection, pre-meeting briefs",
        "Task sync across Notion, GitHub PR staleness, and Trello card status",
        "Intent-classification chat layer routes commands to the right service",
        "Persistent memory store that learns voice, VIP contacts and preferences",
        "Smart LLM router falls back from Gemini to Groq on rate limits",
      ],
      challenges: "Managing conversation context without exceeding token limits while keeping responses relevant was the core challenge, along with building a reliable fallback between Gemini and Groq when either hits rate limits. This project is actively evolving.",
    },
    {
      slug: "car-rental",
      name: "Car Rental Platform",
      desc: "A full MERN car rental platform covering browsing, booking and payments, with Stripe/Razorpay integration.",
      longDesc: "A complete car rental booking platform built on the MERN stack — covering vehicle browsing, booking and payments end-to-end. Integrated Stripe and Razorpay for payment processing, Cloudinary for vehicle image hosting, and Winston for structured logging, with JWT-based authentication throughout.",
      tech: ["Node.js", "Express", "MongoDB", "React", "JWT", "Stripe", "Razorpay", "Cloudinary", "Winston"],
      githubUrl: "https://github.com/rahulpawar-31/car-rental",
      liveUrl: "https://car-rental-two-ochre.vercel.app",
      gradient: "from-sky-400 to-blue-500",
      features: [
        "Vehicle browsing, booking and payment flow end-to-end",
        "Stripe and Razorpay integration for payment processing",
        "Cloudinary for vehicle image hosting",
        "JWT-based authentication",
        "Winston for structured server-side logging",
        "Deployed as a Vite monorepo (web/ subdirectory) on Vercel",
      ],
      challenges: "Working through Razorpay's onboarding process and getting both payment providers working reliably alongside a Vite monorepo deploy setup on Vercel was the trickiest part.",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`Seeded: ${project.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
