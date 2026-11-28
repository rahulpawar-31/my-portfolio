import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/SectionHeading";
import { FeatureExplanation } from "@/components/HowItWorks";
import ProjectGrid from "@/components/ProjectGrid";

export default async function Projects() {
  let projects = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Projects: failed to fetch projects", error);
  }

  return (
    <section className="py-24 px-6 bg-white dark:bg-black" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading eyebrow="What I've built" title="My Projects" />
        </div>
        <FeatureExplanation feature="projects" className="mb-8" />
        <ProjectGrid projects={projects.map(({ slug, name, desc, tech, githubUrl, liveUrl, gradient }) => ({ slug, name, desc, tech, githubUrl, liveUrl, gradient }))} />
      </div>
    </section>
  );
}
