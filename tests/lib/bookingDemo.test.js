import { describe, expect, it } from "vitest";
import { calculateDemoQuote } from "@/lib/bookingDemo";

const options = { vehicleId: "city", rentalType: "day", duration: "2", couponId: "none" };

describe("Sample booking pricing", () => {
  it("applies a percentage discount before GST and adds the deposit last", () => {
    expect(calculateDemoQuote({ ...options, couponId: "welcome10" })).toEqual({ base: 3600, discount: 360, tax: 583, deposit: 1500, total: 5323 });
  });

  it("uses the hourly fallback rate and caps a flat discount at the rental subtotal", () => {
    expect(calculateDemoQuote({ ...options, rentalType: "hour", couponId: "save500" })).toEqual({ base: 450, discount: 450, tax: 0, deposit: 1500, total: 1500 });
  });

  it("calculates airport transfers independently of the hidden duration field", () => {
    expect(calculateDemoQuote({ ...options, rentalType: "airport", duration: "" })).toEqual({ base: 720, discount: 0, tax: 130, deposit: 1500, total: 2350 });
  });

  it.each(["", "0", "-1", "1.5", "31", "Infinity", "abc"])("rejects invalid daily duration %s", (duration) => {
    expect(calculateDemoQuote({ ...options, duration })).toBeNull();
  });

  it("enforces the hourly limit and rejects unknown choices", () => {
    expect(calculateDemoQuote({ ...options, rentalType: "hour", duration: "25" })).toBeNull();
    expect(calculateDemoQuote({ ...options, vehicleId: "unknown" })).toBeNull();
    expect(calculateDemoQuote({ ...options, couponId: "unknown" })).toBeNull();
    expect(calculateDemoQuote({ ...options, rentalType: "week" })).toBeNull();
  });
});
