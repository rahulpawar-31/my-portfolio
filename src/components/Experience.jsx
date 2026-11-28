"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { experience as defaultExperience } from "@/lib/career";
import { fadeInUpOnScroll } from "@/lib/motion";
import { externalLinkProps } from "@/lib/site";
import { tagPill } from "@/lib/styles";

function SubHeading({ children }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
      {children}
    </h4>
  );
}

function ExperienceCard({ job }) {
  const contributions = job.contributions ?? [];
  const results = job.results ?? [];
  const pullRequests = job.pullRequests ?? [];

  return (
    <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8">
      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-5" />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{job.role}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{job.company}</p>
        </div>
        {(job.period || job.current) && (
          <div className="flex items-center gap-2 shrink-0">
            {job.period && (
              <span className="text-sm font-mono text-amber-700 dark:text-yellow-400">{job.period}</span>
            )}
            {job.current && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                Current
              </span>
            )}
          </div>
        )}
      </div>

      {job.products?.length > 0 && (
        <div className="mt-6">
          <SubHeading>Products</SubHeading>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {job.products.map((product) => (
              <li key={product.name} className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-4">
                {product.url ? (
                  <a
                    href={product.url}
                    {...externalLinkProps}
                    className="font-semibold text-zinc-900 dark:text-white hover:text-amber-700 dark:hover:text-yellow-400 transition-colors"
                  >
                    {product.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="font-semibold text-zinc-900 dark:text-white">{product.name}</span>
                )}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{product.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contributions.length > 0 && (
        <div className="mt-6">
          <SubHeading>What I built</SubHeading>
          <ul className="space-y-2">
            {contributions.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <SubHeading>Results</SubHeading>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {results.map((result) => (
              <div key={result.label} className="flex flex-col gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{result.label}</dt>
                <dd className="text-2xl font-bold text-zinc-900 dark:text-white order-first">{result.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {pullRequests.length > 0 && (
        <div className="mt-6">
          <SubHeading>Selected pull requests</SubHeading>
          <ul className="space-y-3">
            {pullRequests.map((pr) => (
              <li key={pr.url} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <a
                  href={pr.url}
                  {...externalLinkProps}
                  className="font-semibold text-zinc-900 dark:text-white hover:text-amber-700 dark:hover:text-yellow-400 transition-colors"
                >
                  {pr.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {pr.problem && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Problem: </span>
                    {pr.problem}
                  </p>
                )}
                {pr.solution && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Solution: </span>
                    {pr.solution}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.tech?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <span key={t} className={`text-xs px-3 py-1 ${tagPill}`}>{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Experience({ items = defaultExperience }) {
  if (!items?.length) return null;

  return (
    <section id="experience" className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-12" {...fadeInUpOnScroll()}>
          <SectionHeading eyebrow="Where I've worked" title="Experience" />
        </motion.div>
        <div className="space-y-6">
          {items.map((job, i) => (
            <motion.div key={`${job.company}-${job.role}`} {...fadeInUpOnScroll(i * 0.1, 0.5, 30)}>
              <ExperienceCard job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
