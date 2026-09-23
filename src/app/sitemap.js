import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Queries the DB for project slugs, which isn't reachable at build time in
// this project's environment (same reason projects/[slug]/page.jsx has no
// generateStaticParams) — force this to run per-request instead.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const projects = await prisma.project.findMany({
    select: { slug: true, updatedAt: true },
  });

  const projectEntries = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projectEntries,
  ];
}
