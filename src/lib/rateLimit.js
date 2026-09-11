const globalForLimiters = globalThis;
const stores = globalForLimiters.rateLimitStores ?? new Map();
globalForLimiters.rateLimitStores = stores;

/**
 * Best-effort client identity for abuse limits.
 *
 * Only headers written by the platform proxy are trusted: `x-forwarded-for` is
 * appended to by every hop, so its leftmost value is client-controlled and
 * trivially spoofed. The rightmost value is the one our own proxy observed.
 */
export function clientIp(req) {
  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) return vercelForwarded.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",");
    return hops[hops.length - 1].trim();
  }

  return "unknown";
}

/**
 * In-process sliding window. On serverless platforms the state is per instance,
 * so this stops casual abuse rather than a distributed attack; a shared store
 * (Vercel KV, Upstash) would be needed for a hard guarantee.
 */
export function createRateLimiter({ name, max, windowMs }) {
  const hits = stores.get(name) ?? new Map();
  stores.set(name, hits);

  const prune = (now) => {
    for (const [key, timestamps] of hits) {
      const recent = timestamps.filter((t) => now - t < windowMs);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
  };

  return {
    /** Non-mutating: does not consume quota, so failed requests are not charged. */
    isOverLimit(key) {
      const now = Date.now();
      prune(now);
      return (hits.get(key) ?? []).length >= max;
    },

    record(key) {
      const now = Date.now();
      hits.set(key, [...(hits.get(key) ?? []), now]);
    },

    reset() {
      hits.clear();
    },
  };
}
