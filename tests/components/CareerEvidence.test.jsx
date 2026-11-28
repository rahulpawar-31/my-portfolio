// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import ProjectShowcase from "@/components/ProjectShowcase";

const fullJob = {
  company: "Webby Wonder",
  role: "Junior Web Developer Intern",
  period: "Jun 2026 – Present",
  current: true,
  products: [{ name: "MakeMySiteLive", desc: "Static-site hosting.", url: "https://example.com" }],
  contributions: ["Built the moderation queue."],
  results: [{ value: "12", label: "features shipped" }],
  pullRequests: [
    { title: "Add review notes", url: "https://github.com/org/repo/pull/1", problem: "No notes.", solution: "Added notes." },
  ],
};

describe("Experience", () => {
  it("renders the Webby Wonder internship from the default data without empty sections", () => {
    render(<Experience />);

    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByText("Junior Web Developer Intern")).toBeInTheDocument();
    expect(screen.getByText("Webby Wonder")).toBeInTheDocument();
    expect(screen.getByText("CountryStateCity")).toBeInTheDocument();
    expect(screen.getByText("MakeMySiteLive")).toBeInTheDocument();
    expect(screen.queryByText("What I built")).not.toBeInTheDocument();
    expect(screen.queryByText("Results")).not.toBeInTheDocument();
    expect(screen.queryByText("Selected pull requests")).not.toBeInTheDocument();
  });

  it("renders contributions, results and pull requests once they are filled in", () => {
    render(<Experience items={[fullJob]} />);

    expect(screen.getByText("Jun 2026 – Present")).toBeInTheDocument();
    expect(screen.getByText("Built the moderation queue.")).toBeInTheDocument();
    expect(screen.getByText("features shipped")).toBeInTheDocument();
    const pr = screen.getByRole("link", { name: /add review notes/i });
    expect(pr).toHaveAttribute("href", "https://github.com/org/repo/pull/1");
    expect(pr).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders nothing when there is no experience", () => {
    const { container } = render(<Experience items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Testimonials", () => {
  it("stays hidden until a testimonial is added", () => {
    const { container } = render(<Testimonials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a quote with its attribution", () => {
    render(<Testimonials items={[{ quote: "Great work.", name: "A. Person", role: "Lead", company: "Webby Wonder" }]} />);
    expect(screen.getByText(/Great work\./)).toBeInTheDocument();
    expect(screen.getByText("A. Person")).toBeInTheDocument();
    expect(screen.getByText(/Lead, Webby Wonder/)).toBeInTheDocument();
  });
});

describe("ProjectShowcase", () => {
  it("renders nothing for a project without screenshots or contribution notes", () => {
    const { container } = render(<ProjectShowcase slug="unknown-project" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("provides a source-backed car-rental case study and a working playground link", () => {
    render(<ProjectShowcase slug="car-rental" />);
    expect(screen.getByRole("heading", { name: "Keeping a booking quote consistent" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Still to improve" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try the quote playground" })).toHaveAttribute("href", "/#playground");
    expect(screen.getByRole("link", { name: /read the pricing implementation/i })).toHaveAttribute("href", "https://github.com/rahulpawar-31/car-rental/blob/main/api/src/services/booking.quote.js");
  });

  it("renders screenshots and only the filled contribution fields", () => {
    render(
      <ProjectShowcase
        slug="car-rental"
        showcase={{
          screenshots: [{ src: "/screenshots/car-rental-home.png", alt: "Car rental home page", caption: "Browsing cars" }],
          contribution: { built: "The booking flow.", hardestProblem: "Double bookings." },
        }}
      />
    );

    expect(screen.getByAltText("Car rental home page")).toBeInTheDocument();
    expect(screen.getByText("Browsing cars")).toBeInTheDocument();
    expect(screen.getByText("The booking flow.")).toBeInTheDocument();
    expect(screen.getByText("Double bookings.")).toBeInTheDocument();
    expect(screen.queryByText("Why this approach")).not.toBeInTheDocument();
  });
});
