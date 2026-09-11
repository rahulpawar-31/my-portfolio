import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// framer-motion's whileInView relies on IntersectionObserver, which jsdom lacks.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver = IntersectionObserverStub;
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

// jsdom's matchMedia reports `false` for every feature query, so components
// gated on a fine pointer would render nothing under test.
if (typeof window !== "undefined") {
  window.matchMedia = (query) => ({
    matches: query.includes("pointer: fine"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
