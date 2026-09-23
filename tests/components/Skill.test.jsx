// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Skills from "@/components/Skill";

describe("Skills", () => {
  it("renders each skill group heading", () => {
    render(<Skills />);

    expect(screen.getByRole("heading", { name: "My Skills" })).toBeInTheDocument();
    for (const group of ["Frontend", "Backend", "Database", "Tools & AI"]) {
      expect(screen.getByText(group)).toBeInTheDocument();
    }
  });

  it("renders every skill exactly once", () => {
    render(<Skills />);

    const skills = [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Payload CMS",
      "REST API",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Prisma",
      "Git",
      "GitHub",
      "Docker",
      "Vercel",
      "Railway",
      "Stripe/Razorpay",
      "Claude",
      "OpenAI GPT",
      "LangChain.js",
    ];

    for (const skill of skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });
});
