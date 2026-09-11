"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { GitHubIcon } from "@/components/icons";
import { externalLinkProps, socials } from "@/lib/site";
import { useMounted } from "@/hooks/useMounted";

export default function GitHubActivity() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // re-fetch every 5 minutes so new pushes show up without a page reload
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950" id="github">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="Open Source"
            title="GitHub Activity"
            description="My contribution history over the past year — commits, PRs and reviews across personal and open source projects."
            titleClassName="mb-4"
            descriptionClassName="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto"
          />
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 overflow-x-auto">
          {mounted && (
            <GitHubCalendar
              key={refreshKey}
              username="rahulpawar-31"
              colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              theme={{
                light: ["#f4f4f5", "#fef08a", "#fde047", "#facc15", "#eab308"],
                dark: ["#27272a", "#713f12", "#a16207", "#ca8a04", "#eab308"],
              }}
            />
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={socials.github}
            {...externalLinkProps}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <GitHubIcon size={16} />
            View full profile on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
