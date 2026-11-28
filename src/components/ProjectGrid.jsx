"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { externalLinkProps } from "@/lib/site";
import { projectCategory, projectEvidence } from "@/lib/projectEvidence";

export default function ProjectGrid({ projects }) {
  const [category, setCategory] = useState("All");
  const [technology, setTechnology] = useState("All");
  const technologyId = useId();
  const categories = ["All", ...new Set(projects.map(projectCategory))];
  const technologies = [...new Set(projects.flatMap((project) => project.tech))].sort();
  const visibleProjects = projects.filter((project) =>
    (category === "All" || projectCategory(project) === category) &&
    (technology === "All" || project.tech.includes(technology))
  ).sort((a, b) => (projectEvidence[a.slug]?.featuredOrder ?? 3) - (projectEvidence[b.slug]?.featuredOrder ?? 3));
  const reset = () => { setCategory("All"); setTechnology("All"); };

  return (
    <div>
      {projects.length > 0 && <div className="mb-8 space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${category === item ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-zinc-300 text-zinc-600 hover:border-amber-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-yellow-400"}`}>{item}</button>)}
          </div>
          <label htmlFor={technologyId} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">Technology
            <select id={technologyId} value={technology} onChange={(event) => setTechnology(event.target.value)} className="portfolio-select min-h-11 max-w-48 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white">
              <option value="All">All technologies</option>
              {technologies.map((tech) => <option key={tech} value={tech}>{tech}</option>)}
            </select>
          </label>
        </div>
        <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">Showing {visibleProjects.length} of {projects.length} projects</p>
      </div>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleProjects.map((project) => {
          const evidence = projectEvidence[project.slug];
          const screenshot = evidence?.screenshots?.[0];
          return (
            <article key={project.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600">
              {screenshot ? <Link href={`/projects/${project.slug}`} aria-label={`Preview ${project.name}`} className="relative block aspect-[8/5] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} sizes="(min-width: 1200px) 552px, (min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
              </Link> : <div className="flex aspect-[8/5] min-h-72 flex-col justify-between border-b border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
                <span className="text-sm font-mono text-amber-700 dark:text-yellow-400">{projectCategory(project)} project</span>
                {evidence?.endpoints ? <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">API routes</p>
                  {evidence.endpoints.map((endpoint) => <p key={`${endpoint.method}${endpoint.path}`} className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm"><span className="font-semibold text-amber-700 dark:text-yellow-400">{endpoint.method}</span><span className="break-all text-zinc-700 dark:text-zinc-300">{endpoint.path}</span></p>)}
                </div> : <div><p className="mb-4 text-2xl font-semibold tracking-tight">{project.name}</p><div className={`h-1 w-16 rounded-full bg-gradient-to-r ${project.gradient}`} /></div>}
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{project.tech.slice(0, 3).join(" / ")}</p>
              </div>}
              <div className="flex flex-1 flex-col p-6">
                {screenshot && <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{screenshot.caption}</p>}
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-lg font-bold group-hover:text-amber-700 dark:group-hover:text-yellow-400">{project.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.slug === "personal-ai" && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">In Progress</span>}
                    {project.liveUrl && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Live</span>}
                  </div>
                </div>
                <p className="mb-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{project.desc}</p>
                <div className="mb-6 flex flex-wrap gap-2">{project.tech.slice(0, 4).map((tech) => <span key={tech} className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{tech}</span>)}</div>
                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <Link href={`/projects/${project.slug}${evidence?.caseStudy ? "#case-study" : ""}`} className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100">{evidence?.caseStudy ? "Read case study" : "View Details"}</Link>
                  <a href={project.githubUrl} {...externalLinkProps} aria-label={`GitHub: ${project.name}`} className="inline-flex min-h-11 items-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">GitHub</a>
                  {project.liveUrl && <a href={project.liveUrl} {...externalLinkProps} aria-label={`Live: ${project.name}`} className="inline-flex min-h-11 items-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Live</a>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visibleProjects.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="text-base text-zinc-600 dark:text-zinc-400">{projects.length ? "No projects match these filters." : "Projects are unavailable right now. Please try again shortly."}</p>
        {projects.length > 0 && <button type="button" onClick={reset} className="mt-4 min-h-11 text-sm font-semibold text-amber-800 underline underline-offset-4 dark:text-yellow-400">Clear filters</button>}
      </div>}
    </div>
  );
}
