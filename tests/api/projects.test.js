import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
const findUnique = vi.fn();
const update = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { project: { findMany, findUnique, update } },
}));

const { GET: getProjects } = await import("@/app/api/projects/route");
const { GET: getProject } = await import("@/app/api/projects/[slug]/route");
const { GET: getViewCount, POST: recordView } = await import(
  "@/app/api/projects/[slug]/view/route"
);
const { createRateLimiter } = await import("@/lib/rateLimit");

const context = (slug) => ({ params: Promise.resolve({ slug }) });

const request = (ip = "203.0.113.1") => ({
  headers: new Headers({ "x-real-ip": ip }),
});

const project = { id: 1, slug: "portfolio", name: "Portfolio", viewCount: 7 };

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  createRateLimiter({ name: "project-views", max: 1, windowMs: 1 }).reset();
  update.mockReset();
  findUnique.mockReset();
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

describe("POST /api/projects/[slug]/view", () => {
  it("increments the view count", async () => {
    update.mockResolvedValue({ viewCount: 8 });

    const res = await recordView(request(), context("portfolio"));

    expect(update).toHaveBeenCalledWith({
      where: { slug: "portfolio" },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ viewCount: 8 });
  });

  it("does not increment twice for the same client and slug", async () => {
    update.mockResolvedValue({ viewCount: 8 });
    findUnique.mockResolvedValue({ ...project, viewCount: 8 });

    await recordView(request(), context("portfolio"));
    const res = await recordView(request(), context("portfolio"));

    expect(update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ viewCount: 8 });
  });

  it("counts a different client separately", async () => {
    update.mockResolvedValue({ viewCount: 9 });

    await recordView(request("203.0.113.1"), context("portfolio"));
    await recordView(request("203.0.113.2"), context("portfolio"));

    expect(update).toHaveBeenCalledTimes(2);
  });

  it("returns 404 when the project does not exist", async () => {
    update.mockRejectedValue(Object.assign(new Error("not found"), { code: "P2025" }));

    const res = await recordView(request(), context("nope"));

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Project not found" });
  });

  it("returns 500 when the update fails", async () => {
    update.mockRejectedValue(new Error("db down"));

    const res = await recordView(request(), context("portfolio"));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Failed to update view count" });
  });
});
