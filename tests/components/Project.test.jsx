// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { project: { findMany } },
}));

const Projects = (await import("@/components/Project")).default;

const baseProject = {
  slug: "portfolio",
  name: "Portfolio",
  desc: "My portfolio site",
  gradient: "from-yellow-400 to-orange-400",
  tech: ["Next.js", "Prisma", "Tailwind", "Neon", "Vercel"],
  githubUrl: "https://github.com/rahulpawar-31/my-portfolio",
  liveUrl: "https://example.com",
};

const renderProjects = async () => render(await Projects());

describe("Project list", () => {
  beforeEach(() => {
    findMany.mockResolvedValue([baseProject]);
  });

  it("fetches projects oldest first", async () => {
    await renderProjects();

    expect(findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "asc" } });
  });

  it("renders a card per project with its details links", async () => {
    await renderProjects();

    expect(screen.getByRole("heading", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByText("My portfolio site")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/projects/portfolio"
    );
    expect(screen.getByRole("link", { name: "GitHub: Portfolio" })).toHaveAttribute(
      "href",
      baseProject.githubUrl
    );
  });

  it("shows at most four tech tags", async () => {
    await renderProjects();

    for (const tech of ["Next.js", "Prisma", "Tailwind", "Neon"]) {
      expect(screen.getByText(tech, { selector: "span" })).toBeInTheDocument();
    }
    expect(screen.queryByText("Vercel", { selector: "span" })).not.toBeInTheDocument();
  });

  it("marks deployed projects as live", async () => {
    await renderProjects();

    expect(screen.getByText("Live", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Live: Portfolio" })).toHaveAttribute(
      "href",
      baseProject.liveUrl
    );
  });

  it("omits the live badge and link when there is no deployment", async () => {
    findMany.mockResolvedValue([{ ...baseProject, liveUrl: null }]);

    await renderProjects();

    expect(screen.queryByText("Live")).not.toBeInTheDocument();
  });

  it("flags the personal-ai project as in progress", async () => {
    findMany.mockResolvedValue([{ ...baseProject, slug: "personal-ai", liveUrl: null }]);

    await renderProjects();

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders the empty state heading when there are no projects", async () => {
    findMany.mockResolvedValue([]);

    await renderProjects();

    expect(screen.getByRole("heading", { name: "My Projects" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "View Details" })).not.toBeInTheDocument();
  });
});
