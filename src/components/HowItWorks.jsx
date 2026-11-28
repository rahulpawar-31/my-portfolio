"use client";

import { createContext, useContext, useId, useState } from "react";
import { featureExplanations } from "@/lib/featureExplanations";
import { externalLinkProps, socials } from "@/lib/site";

const HowItWorksContext = createContext(null);

export function HowItWorksProvider({ children }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <HowItWorksContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </HowItWorksContext.Provider>
  );
}

function CodeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

export function HowItWorksToggle() {
  const mode = useContext(HowItWorksContext);
  const descriptionId = useId();
  if (!mode) return null;

  return (
    <aside aria-label="Explore this portfolio" className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 dark:border-yellow-400/20 bg-amber-50 dark:bg-yellow-400/5 text-amber-700 dark:text-yellow-400">
            <CodeIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">There&apos;s more behind this page.</p>
            <p id={descriptionId} className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {mode.enabled
                ? "Open the highlighted notes to explore the code behind each feature."
                : "Discover how the projects, live data, and contact form are built."}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={mode.enabled}
          aria-describedby={descriptionId}
          onClick={() => mode.setEnabled((value) => !value)}
          className="inline-flex min-h-11 w-fit shrink-0 items-center gap-3 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:border-amber-600 dark:hover:border-yellow-400 transition-colors"
        >
          How this works
          <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition-colors ${mode.enabled ? "bg-amber-700 dark:bg-yellow-400" : "bg-zinc-300 dark:bg-zinc-600"}`}>
            <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white dark:bg-zinc-950 transition-transform motion-reduce:transition-none ${mode.enabled ? "translate-x-5" : "translate-x-0"}`} />
          </span>
        </button>
      </div>
    </aside>
  );
}

export function FeatureExplanation({ feature, className = "" }) {
  const mode = useContext(HowItWorksContext);
  const explanation = featureExplanations[feature];
  if (!mode?.enabled || !explanation) return null;

  return (
    <details className={`group/explanation rounded-2xl border border-amber-300 dark:border-yellow-400/30 bg-amber-50/70 dark:bg-yellow-400/5 text-left ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl p-5 [&::-webkit-details-marker]:hidden">
        <CodeIcon className="h-5 w-5 shrink-0 text-amber-700 dark:text-yellow-400" />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-yellow-400">Under the hood</span>
          <span className="mt-1 block text-base font-semibold text-zinc-900 dark:text-zinc-100">{explanation.title}</span>
        </span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-700 dark:text-yellow-400 transition-transform motion-reduce:transition-none group-open/explanation:rotate-180">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <div className="border-t border-amber-200 dark:border-yellow-400/20 px-5 pb-5 pt-4">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{explanation.description}</p>
        <ol className="mt-5 space-y-5 border-l border-amber-300 dark:border-yellow-400/30 pl-5">
          {explanation.steps.map((step) => (
            <li key={step.title}>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</p>
              <p className="mt-1 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>
        <a href={`${socials.github}/my-portfolio/blob/main/${explanation.source}`} {...externalLinkProps} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-yellow-400 underline underline-offset-4 hover:text-amber-950 dark:hover:text-yellow-200">
          {explanation.sourceLabel}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </details>
  );
}
