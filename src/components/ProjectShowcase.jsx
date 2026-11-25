import Image from "next/image";
import { projectShowcase } from "@/lib/career";

const contributionFields = [
  { key: "built", label: "What I built" },
  { key: "hardestProblem", label: "Hardest problem" },
  { key: "approach", label: "Why this approach" },
];

export default function ProjectShowcase({ slug, showcase = projectShowcase[slug] }) {
  const screenshots = showcase?.screenshots ?? [];
  const contribution = showcase?.contribution ?? {};
  const filledFields = contributionFields.filter(({ key }) => contribution[key]);

  if (!screenshots.length && !filledFields.length) return null;

  return (
    <div className="mb-10 space-y-10">
      {screenshots.length > 0 && (
        <section aria-labelledby="screenshots-heading">
          <h2 id="screenshots-heading" className="text-lg font-bold mb-4">Screenshots</h2>
          <div className="space-y-6">
            {screenshots.map((shot, i) => (
              <figure key={shot.src}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width ?? 1600}
                  height={shot.height ?? 1000}
                  sizes="(min-width: 768px) 768px, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-auto rounded-xl border border-zinc-200 dark:border-zinc-800"
                />
                {shot.caption && (
                  <figcaption className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{shot.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {filledFields.length > 0 && (
        <section
          aria-labelledby="contribution-heading"
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6"
        >
          <h2 id="contribution-heading" className="text-lg font-bold mb-4">My contribution</h2>
          <dl className="space-y-4">
            {filledFields.map(({ key, label }) => (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-yellow-400">{label}</dt>
                <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{contribution[key]}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
