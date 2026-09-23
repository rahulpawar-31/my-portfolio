import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { externalLinkProps, socials } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div>
            <p className="text-lg font-bold tracking-tight">Rahul<span className="text-yellow-400">.</span>dev</p>
            <p className="text-xs text-zinc-500 mt-1">Full Stack Developer · India</p>
          </div>

          <div className="flex gap-3">
            <a href={socials.github} {...externalLinkProps} className="w-9 h-9 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors" aria-label="GitHub">
              <GitHubIcon size={16} />
            </a>
            <a href={socials.linkedin} {...externalLinkProps} className="w-9 h-9 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors" aria-label="LinkedIn">
              <LinkedInIcon size={16} />
            </a>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© 2026 Rahul Pawar. All rights reserved.</p>
          <p>Built with Next.js · Tailwind CSS · Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
