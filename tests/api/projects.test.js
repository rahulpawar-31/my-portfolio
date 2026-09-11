import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
const findUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { project: { findMany, findUnique } },
}));

const { GET: getProjects } = await import("@/app/api/projects/route");
const { GET: getProject } = await import("@/app/api/projects/[slug]/route");
const { GET: getViewCount } = await import("@/app/api/projects/[slug]/view/route");
const { GET: syncProject } = await import("@/app/api/sync/[slug]/route");

const context = (slug) => ({ params: Promise.resolve({ slug }) });

const project = { id: 1, slug: "portfolio", name: "Portfolio", viewCount: 7 };

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/projects", () => {
  it("returns every project", async () => {
    findMany.mockResolvedValue([project]);

    const res = await getProjects();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([project]);
  });

  it("returns 500 when the query fails", async () => {
    findMany.mockRejectedValue(new Error("db down"));

    const res = await getProjects();

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Failed to fetch projects" });
  });
});

describe("GET /api/projects/[slug]", () => {
  it("returns the project for the slug", async () => {
    findUnique.mockResolvedValue(project);

    const res = await getProject({}, context("portfolio"));

    expect(findUnique).toHaveBeenCalledWith({ where: { slug: "portfolio" } });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(project);
  });

  it("returns 404 when the project does not exist", async () => {
    findUnique.mockResolvedValue(null);

    const res = await getProject({}, context("nope"));

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Project not found" });
  });

  it("returns 500 when the query fails", async () => {
    findUnique.mockRejectedValue(new Error("db down"));

    const res = await getProject({}, context("portfolio"));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Failed to fetch project" });
  });
});

describe("GET /api/projects/[slug]/view", () => {
  it("returns the stored view count", async () => {
    findUnique.mockResolvedValue(project);

    const res = await getViewCount({}, context("portfolio"));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ viewCount: 7 });
  });

  it("returns 404 for an unknown project", async () => {
    findUnique.mockResolvedValue(null);

    const res = await getViewCount({}, context("nope"));

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Project not found" });
  });

  it("falls back to zero when viewCount is null", async () => {
    findUnique.mockResolvedValue({ ...project, viewCount: null });

    const res = await getViewCount({}, context("portfolio"));

    await expect(res.json()).resolves.toEqual({ viewCount: 0 });
  });

  it("returns 500 when the query fails", async () => {
    findUnique.mockRejectedValue(new Error("db down"));

    const res = await getViewCount({}, context("portfolio"));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Failed to fetch view count" });
  });
});

describe("GET /api/sync/[slug]", () => {
  it("returns the project for the slug", async () => {
    findUnique.mockResolvedValue(project);

    const res = await syncProject({}, context("portfolio"));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(project);
  });

  it("returns 400 when the slug is missing", async () => {
    const res = await syncProject({}, context(undefined));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Slug is required" });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 when the project does not exist", async () => {
    findUnique.mockResolvedValue(null);

    const res = await syncProject({}, context("nope"));

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Project not found" });
  });

  it("returns 500 when the query fails", async () => {
    findUnique.mockRejectedValue(new Error("db down"));

    const res = await syncProject({}, context("portfolio"));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Failed to fetch project" });
  });
});
