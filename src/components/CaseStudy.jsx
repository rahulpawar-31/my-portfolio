import Link from "next/link";
import { externalLinkProps } from "@/lib/site";

export default function CaseStudy({ study }) {
  if (!study) return null;
  return (
    <section id="case-study" aria-labelledby="case-study-heading" className="scroll-mt-24 space-y-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-700 dark:text-yellow-400">Engineering case study</p>
        <h2 id="case-study-heading" className="text-2xl font-bold tracking-tight">{study.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{study.summary}</p>
      </div>
      <div><h3 className="mb-2 text-lg font-semibold">The problem</h3><p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{study.problem}</p></div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Design decisions</h3>
        <div className="space-y-5">{study.decisions.map((decision) => <div key={decision.title} className="border-l-2 border-amber-500 pl-4"><h4 className="font-semibold">{decision.title}</h4><p className="mt-1 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{decision.description}</p></div>)}</div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">How the pieces fit</h3>
        <ol className="grid gap-3 sm:grid-cols-2">{study.architecture.map((step) => <li key={step.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4"><h4 className="font-semibold">{step.title}</h4><p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{step.detail}</p></li>)}</ol>
      </div>
      <div><h3 className="mb-2 text-lg font-semibold">The result</h3><p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{study.outcome}</p></div>
      {study.limitation && <div><h3 className="mb-2 text-lg font-semibold">Still to improve</h3><p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{study.limitation}</p></div>}
      <div className="flex flex-col items-start gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        {study.playground && <Link href="/#playground" className="inline-flex min-h-11 items-center rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black">Try the quote playground</Link>}
        {study.sources.map((source) => <a key={source.url} href={source.url} {...externalLinkProps} className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-800 underline underline-offset-4 dark:text-yellow-400">{source.label}<span className="sr-only"> (opens in a new tab)</span></a>)}
      </div>
    </section>
  );
}
