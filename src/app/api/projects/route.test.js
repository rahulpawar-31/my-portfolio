import { describe, it, expect, vi, beforeEach } from "vitest";

const findManyMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { project: { findMany: findManyMock } },
}));

const { GET } = await import("./route");

describe("GET /api/projects", () => {
  beforeEach(() => {
    findManyMock.mockReset();
  });

  it("returns the list of projects", async () => {
    findManyMock.mockResolvedValue([{ slug: "demo", name: "Demo" }]);
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([{ slug: "demo", name: "Demo" }]);
  });

  it("returns a 500 when the database query fails", async () => {
    findManyMock.mockRejectedValue(new Error("connection refused"));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
