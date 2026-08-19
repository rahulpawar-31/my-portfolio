import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const GITHUB_USERNAME = "rahul4091";

const GRADIENTS = [
  "from-yellow-400 to-orange-500",
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-green-400 to-emerald-500",
  "from-red-500 to-rose-400",
];

function createPrisma() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  private: boolean;
  owner: { login: string };
  language: string | null;
  topics: string[];
}

interface ClaudeEnrichment {
  name: string;
  desc: string;
  longDesc: string;
  tech: string[];
  features: string[];
  challenges: string;
}

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const batch: GitHubRepo[] = await res.json() as GitHubRepo[];
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }

  return repos.filter(
    (r) =>
      r.owner.login === GITHUB_USERNAME &&
      r.fork === false &&
      r.private === false &&
      r.description !== null &&
      r.description.trim() !== ""
  );
}

async function fetchReadme(repoName: string): Promise<string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
    { headers }
  );
  if (!res.ok) return "";
  const text = await res.text();
  return text.slice(0, 3000);
}

async function enrichWithClaude(
  repo: GitHubRepo,
  readme: string
): Promise<ClaudeEnrichment> {
  const prompt = `You are generating structured data for a developer portfolio website.

Given this GitHub repository info, generate a JSON object with the exact fields listed.

Repository:
- Name: ${repo.name}
- Description: ${repo.description}
- Language: ${repo.language ?? "Unknown"}
- Topics: ${repo.topics.join(", ") || "none"}
- README (excerpt): ${readme || "Not available"}

Generate a JSON object with ONLY these fields (no extra keys):
{
  "name": "Human-readable project name (Title Case, max 40 chars)",
  "desc": "Short 1-2 sentence description for the project card (max 120 chars)",
  "longDesc": "3-4 paragraph detailed description for the project detail page",
  "tech": ["array", "of", "tech", "stack", "names", "max 8 items"],
  "features": ["4-6 key features as short strings"],
  "challenges": "1-2 paragraph about interesting technical challenges or learnings"
}

Return ONLY valid JSON, no markdown fences, no extra text.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} — ${err}`);
  }

  const data = await res.json() as { content: { text: string }[] };
  const text = data.content[0].text.trim();
  return JSON.parse(text) as ClaudeEnrichment;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const prisma = createPrisma();

  try {
    console.log("Fetching GitHub repos...");
    const repos = await fetchGitHubRepos();
    console.log(`Found ${repos.length} eligible repos`);

    const existing = await prisma.project.findMany({
      select: { githubUrl: true },
    });
    const existingUrls = new Set(existing.map((p) => p.githubUrl));

    const newRepos = repos.filter((r) => !existingUrls.has(r.html_url));
    console.log(
      `${newRepos.length} new repo(s) to add (${existing.length} already in DB)`
    );

    if (newRepos.length === 0) {
      console.log("Nothing to sync. Portfolio is up to date.");
      return;
    }

    const projectCount = await prisma.project.count();

    let added = 0;
    for (let i = 0; i < newRepos.length; i++) {
      const repo = newRepos[i];
      console.log(`\nProcessing: ${repo.name}`);

      const readme = await fetchReadme(repo.name);
      const enriched = await enrichWithClaude(repo, readme);
      const gradient = GRADIENTS[(projectCount + i) % GRADIENTS.length];
      const slug = toSlug(repo.name);

      await prisma.project.create({
        data: {
          slug,
          name: enriched.name,
          desc: enriched.desc,
          longDesc: enriched.longDesc,
          tech: enriched.tech,
          githubUrl: repo.html_url,
          liveUrl: repo.homepage?.trim() || null,
          gradient,
          features: enriched.features,
          challenges: enriched.challenges,
        },
      });

      console.log(`  Added: ${enriched.name} (slug: ${slug})`);
      added++;
    }

    console.log(`\nDone. Added ${added} new project(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
