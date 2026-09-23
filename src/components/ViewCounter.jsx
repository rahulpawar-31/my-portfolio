"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "@/components/icons";

export default function ViewCounter({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function registerView() {
      try {
        const res = await fetch(`/api/projects/${slug}/view`, { method: "POST" });
        if (!res.ok) {
          throw new Error(`View count request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setViews(data.viewCount);
      } catch (err) {
        console.error(`Failed to load view count for "${slug}":`, err);
      }
    }

    registerView();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mt-2 shrink-0">
      <EyeIcon size={14} />
      {views === null ? "—" : `${views} views`}
    </span>
  );
}
