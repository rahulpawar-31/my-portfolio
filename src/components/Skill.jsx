"use client";
import { motion } from "framer-motion";

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-700 dark:text-yellow-400 mb-3">
            What I work with
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">My Skills</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.15, duration: 0.5 }}
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
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-yellow-50 dark:hover:bg-yellow-400/10 hover:text-amber-700 dark:hover:text-yellow-400 transition-colors cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.15 + si * 0.05, duration: 0.3 }}
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
