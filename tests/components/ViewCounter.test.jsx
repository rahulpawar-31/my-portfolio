// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ViewCounter from "@/components/ViewCounter";

describe("ViewCounter", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a placeholder until the count arrives", () => {
    fetch.mockReturnValue(new Promise(() => {}));

    render(<ViewCounter slug="portfolio" />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("posts to the view endpoint for the slug and renders the count", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ viewCount: 42 }) });

    render(<ViewCounter slug="portfolio" />);

    await waitFor(() => expect(screen.getByText("42 views")).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith("/api/projects/portfolio/view", { method: "POST" });
  });

  it("keeps the placeholder when the response is not ok", async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    render(<ViewCounter slug="portfolio" />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("keeps the placeholder when the request fails", async () => {
    fetch.mockRejectedValue(new Error("offline"));

    render(<ViewCounter slug="portfolio" />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("refetches when the slug changes", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ viewCount: 1 }) });

    const { rerender } = render(<ViewCounter slug="a" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    rerender(<ViewCounter slug="b" />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith("/api/projects/b/view", { method: "POST" });
  });
});
