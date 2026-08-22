# Rahul's Developer Portfolio

A production-ready full stack developer portfolio built with Next.js, PostgreSQL and Vercel.

**Live:** https://portfolio.rahulcodes.qd.je

---

## About this project

Most developer portfolios are just static pages. I built mine differently — with a real PostgreSQL database (Neon), a working contact form that saves messages and sends emails via Resend, dark mode, animations and a full CI/CD pipeline. The goal was to build something that demonstrates full stack skills, not just frontend design. Every part of this portfolio is something I built and debugged myself — from fixing Prisma 7 breaking changes to setting up branch protection on GitHub.

---

## Tech Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend** — Next.js API Routes, Prisma 7, PostgreSQL (Neon)
- **Email** — Resend API
- **Deployment** — Vercel with CI/CD pipeline

---

## Key Features

- Contact form saves messages to Neon PostgreSQL database
- Email delivery via Resend API
- Dark/light mode with next-themes
- Typewriter animation with hydration fix
- Sticky navbar with scroll blur and active section highlight
- SSG for all project pages — instant load
- Branch protection with PR workflow on GitHub
- Auto-deploy on Vercel with postinstall prisma generate
- View counter on project pages — live data from Neon DB
- README fetched live from GitHub API on project detail pages

---

## What I Learned

The biggest challenge was Prisma 7 — it had major breaking changes from older versions. The PrismaClient needed a Neon driver adapter, the schema lost the url field, and generateStaticParams crashed at build time because it tried to query the DB before the server started. I solved each one systematically: switched to static data for projects, added the @prisma/adapter-neon package, and set engineType to client in the schema. This taught me how to read error messages carefully and debug production build failures.

---

## Project Structure
```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx        # About page
│   ├── projects/[slug]/      # Project detail pages (SSG + ISR)
│   └── api/
│       ├── contact/          # Saves message to DB + sends email
│       └── projects/[slug]/view/  # View counter API (Neon DB)
├── components/
│   ├── Hero.tsx              # Typewriter, trust signals
│   ├── Navbar.tsx            # Sticky, scroll blur, active highlight
│   ├── Project.tsx           # Project cards grid
│   ├── Skill.tsx             # Skills grouped by category
│   ├── Contact.tsx           # Contact form
│   ├── Footer.tsx            # Social links
│   ├── ViewCounter.tsx       # Live view count from Neon
│   └── BackToTop.tsx         # Floating back to top button
└── lib/
    ├── projects.ts           # Static project data
    └── prisma.ts             # Prisma client with Neon adapter
prisma/
├── schema.prisma             # Message + Project models
├── config.ts                 # Prisma 7 config
└── seed.ts                   # Seeds project slugs
```

---

## Local Setup
```bash
# Clone the repo
git clone https://github.com/rahulpawar-31/my-portfolio
cd my-portfolio

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, RESEND_API_KEY, CONTACT_EMAIL

# Push DB schema and seed
npx prisma db push
npx prisma db seed

# Run dev server
npm run dev
```

---

## Environment Variables

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `CONTACT_EMAIL` | Email address to receive contact form messages |

---

## CI/CD Pipeline
```
dev branch → npm run build → git push → PR to main → merge → lint + build check → deploy
```

- Main branch is protected — no direct pushes allowed
- Every change goes through a Pull Request
- On merge, GitHub Actions lints and builds the app on every branch push

### Deployment — source of truth

**Production: the VPS** at `portfolio.rahulcodes.qd.je`, deployed via the `deploy-vps.yml` GitHub Actions workflow (manual trigger on `main`).

Vercel auto-deploys on every push to `main` as a **staging/backup** copy — useful for previewing changes, not the canonical URL. All metadata, sitemap, and OG tags point at the VPS domain.

---

## Author

**Rahul Pawar** — Full Stack Developer
- GitHub: https://github.com/rahulpawar-31
- LinkedIn: https://www.linkedin.com/in/rahulpawar31/
- Email: rahulcpawar3107@gmail.com
