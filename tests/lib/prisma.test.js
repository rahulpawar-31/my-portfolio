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
    // prisma is a lazy proxy — touch a property to trigger client creation
    void prisma.$connect;

    expect(adapterCalls).toEqual([{ connectionString: "postgres://user:pass@host/db" }]);
    expect(prismaClientCalls).toHaveLength(1);
    expect(prismaClientCalls[0].adapter).toBeDefined();
  });

  it("caches the client on globalThis outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const { prisma } = await loadModule();
    void prisma.$connect;

    expect(globalThis.prisma).toBeDefined();
    expect(prismaClientCalls).toHaveLength(1);
  });

  it("reuses a client already cached on globalThis", async () => {
    const cached = { marker: "cached" };
    globalThis.prisma = cached;

    const { prisma } = await loadModule();

    expect(prisma.marker).toBe("cached");
    expect(prismaClientCalls).toHaveLength(0);
  });

  it("does not cache the client in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const { prisma } = await loadModule();
    void prisma.$connect;

    expect(prismaClientCalls).toHaveLength(1);
    expect(globalThis.prisma).toBeUndefined();
  });
});
