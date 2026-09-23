// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Hero from "@/components/Hero";

const advance = (ms) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

// each keystroke schedules the next timeout only after React flushes, so the
// timers have to be advanced one step at a time
const tick = (ms, times) => {
  for (let i = 0; i < times; i += 1) advance(ms);
};

const typeFully = (text) => tick(80, text.length);

const firstRole = "a Developer 💻";

describe("Hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the headline and stat cards", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hi, I'm Rahul");
    expect(screen.getByText("Projects Built")).toBeInTheDocument();
    expect(screen.getByText("Full Stack")).toBeInTheDocument();
    expect(screen.getByText("To Full-time")).toBeInTheDocument();
  });

  it("links to the resume in a new tab", () => {
    render(<Hero />);

    const resume = screen.getByRole("link", { name: /resume/i });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("target", "_blank");
    expect(resume).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("types the first role one character at a time", () => {
    render(<Hero />);

    advance(80);
    expect(screen.getByText("a")).toBeInTheDocument();

    tick(80, 2);
    expect(screen.getByText("a D")).toBeInTheDocument();
  });

  it("deletes the role after the pause and moves to the next one", () => {
    render(<Hero />);

    typeFully(firstRole);
    expect(screen.getByText(firstRole)).toBeInTheDocument();

    // pause before deleting, then delete every character
    advance(1800);
    tick(40, firstRole.length);
    // one more tick flips back to typing the next role
    advance(80);

    expect(screen.queryByText(firstRole)).not.toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("scrolls to the projects section from the CTA", () => {
    const section = document.createElement("div");
    section.id = "projects";
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    render(<Hero />);
    act(() => {
      screen.getByRole("button", { name: "View Projects" }).click();
    });

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    section.remove();
  });

  it("scrolls to the contact section from the CTA", () => {
    const section = document.createElement("div");
    section.id = "contact";
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    render(<Hero />);
    act(() => {
      screen.getByRole("button", { name: "Contact Me" }).click();
    });

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    section.remove();
  });

  it("does not throw when the target section is absent", () => {
    render(<Hero />);

    expect(() =>
      act(() => {
        screen.getByRole("button", { name: "View Projects" }).click();
      })
    ).not.toThrow();
  });
});
