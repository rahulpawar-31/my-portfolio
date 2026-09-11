import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaClientCalls = [];
const adapterCalls = [];

vi.mock("@/generated/prisma", () => ({
  PrismaClient: class {
    constructor(options) {
      prismaClientCalls.push(options);
    }
  },
}));

vi.mock("@prisma/adapter-neon", () => ({
  PrismaNeon: class {
    constructor(options) {
      adapterCalls.push(options);
    }
  },
}));

const loadModule = async () => {
  vi.resetModules();
  return import("@/lib/prisma");
};

describe("lib/prisma", () => {
  beforeEach(() => {
    prismaClientCalls.length = 0;
    adapterCalls.length = 0;
    delete globalThis.prisma;
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@host/db");
  });

  afterEach(() => {
    delete globalThis.prisma;
  });

  it("builds a client with a Neon adapter using DATABASE_URL", async () => {
    const { prisma } = await loadModule();

    expect(prisma).toBeDefined();
    // The client is created lazily, so nothing happens until a query is issued.
    expect(prismaClientCalls).toHaveLength(0);

    void prisma.project;

    expect(adapterCalls).toEqual([{ connectionString: "postgres://user:pass@host/db" }]);
    expect(prismaClientCalls).toHaveLength(1);
    expect(prismaClientCalls[0].adapter).toBeDefined();
  });

  it("throws on first use when DATABASE_URL is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const { prisma } = await loadModule();

    expect(() => prisma.project).toThrow(/DATABASE_URL is not set/);
  });

  it("caches the client on globalThis outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const { prisma } = await loadModule();
    void prisma.project;

    expect(globalThis.prisma).toBeDefined();

    void prisma.project;
    expect(prismaClientCalls).toHaveLength(1);
  });

  it("reuses a client already cached on globalThis", async () => {
    globalThis.prisma = { marker: "cached" };

    const { prisma } = await loadModule();

    expect(prisma.marker).toBe("cached");
    expect(prismaClientCalls).toHaveLength(0);
  });

  it("does not cache the client in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const { prisma } = await loadModule();
    void prisma.project;

    expect(prismaClientCalls).toHaveLength(1);
    expect(globalThis.prisma).toBeUndefined();
  });
});
