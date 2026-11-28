import Link from "next/link";
import { externalLinkProps, resumeUrl } from "@/lib/site";

export default function RecruiterSummary() {
  return (
    <aside aria-labelledby="quick-view-heading" className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div className="lg:max-w-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-700 dark:text-yellow-400">For hiring teams</p>
          <h2 id="quick-view-heading" className="text-2xl font-bold tracking-tight">Rahul, at a glance.</h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">Full stack developer and BCA student, currently interning at Webby Wonder.</p>
        </div>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {[["Looking for", "Full-time full stack roles"], ["Based in", "Mumbai, India"], ["Core stack", "React, Next.js, Node.js"]].map(([label, value]) => <div key={label}><dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}
        </dl>
        <div className="flex shrink-0 flex-wrap gap-3 lg:flex-col">
          <a href={resumeUrl} {...externalLinkProps} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black">View resume<span className="sr-only"> (opens in a new tab)</span></a>
          <Link href="/#contact" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-5 py-2 text-sm font-semibold dark:border-zinc-700">Let&apos;s talk</Link>
        </div>
      </div>
    </aside>
  );
}
