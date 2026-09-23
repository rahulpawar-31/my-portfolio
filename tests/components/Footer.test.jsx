// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the brand and tagline", () => {
    render(<Footer />);

    expect(screen.getByText("Full Stack Developer · India")).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it("links to the social profiles safely", () => {
    render(<Footer />);

    const github = screen.getByRole("link", { name: "GitHub" });
    const linkedin = screen.getByRole("link", { name: "LinkedIn" });

    expect(github).toHaveAttribute("href", "https://github.com/rahulpawar-31");
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/rahulpawar31"
    );
    for (const link of [github, linkedin]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
