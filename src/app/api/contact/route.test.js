import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ error: null });
const createMock = vi.fn().mockResolvedValue({});

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { message: { create: createMock } },
}));

const { POST } = await import("./route");

function makeRequest(body, ip = "203.0.113.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_EMAIL = "owner@example.com";
    sendMock.mockClear();
    createMock.mockClear();
  });

  it("rejects a submission missing required fields", async () => {
    const res = await POST(
      makeRequest({ name: "Rahul", email: "", message: "hi" }, "203.0.113.10")
    );
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const res = await POST(
      makeRequest(
        { name: "Rahul", email: "not-an-email", message: "hi" },
        "203.0.113.11"
      )
    );
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("silently accepts but skips send/save when the honeypot field is filled", async () => {
    const res = await POST(
      makeRequest(
        { name: "Bot", email: "bot@example.com", message: "spam", company: "Acme" },
        "203.0.113.12"
      )
    );
    expect(res.status).toBe(200);
    expect(createMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("saves and emails a valid submission", async () => {
    const res = await POST(
      makeRequest(
        { name: "Rahul", email: "rahul@example.com", message: "Hello there" },
        "203.0.113.13"
      )
    );
    expect(res.status).toBe(200);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("rate limits repeated requests from the same IP", async () => {
    const ip = "203.0.113.99";
    const payload = { name: "Rahul", email: "rahul@example.com", message: "Hello" };
    let lastStatus;
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(payload, ip));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
