"use client";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { fadeInScaleOnScroll, fadeInUpOnScroll } from "@/lib/motion";

const skillGroups = [
  {
    label: "Frontend",
    color: "from-yellow-400 to-orange-400",
    skills: ["HTML", "CSS", "JavaScript", "Next.js", "React"],
  },
  {
    label: "Backend",
    color: "from-green-400 to-teal-400",
    skills: ["Node.js", "Express", "REST API"],
  },
  {
    label: "Database",
    color: "from-blue-400 to-cyan-400",
    skills: ["MongoDB", "SQL", "PostgreSQL", "Prisma"],
  },
];

export default function Skills() {
  return (
    <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          {...fadeInUpOnScroll()}
        >
          <SectionHeading eyebrow="What I work with" title="My Skills" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-shadow duration-300"
              {...fadeInUpOnScroll(gi * 0.15, 0.5, 30)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${group.color}`} />
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                  {group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-yellow-50 dark:hover:bg-yellow-400/10 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-default"
                    {...fadeInScaleOnScroll(gi * 0.15 + si * 0.05)}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
