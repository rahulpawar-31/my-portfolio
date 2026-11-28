// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProjectGrid from "@/components/ProjectGrid";

const projects = [
  { slug: "car-rental", name: "Car Rental", desc: "Booking app", tech: ["React", "MongoDB"], githubUrl: "https://github.com/rahulpawar-31/car-rental", liveUrl: "https://example.com", gradient: "from-blue-400 to-blue-500" },
  { slug: "library-management-system", name: "Library API", desc: "Book management", tech: ["Express", "MongoDB"], githubUrl: "https://github.com/rahulpawar-31/library-management-system", liveUrl: null, gradient: "from-green-400 to-green-500" },
];

describe("Project filters", () => {
  it("combines category and technology filters, explains empty results, and clears both", async () => {
    const user = userEvent.setup();
    render(<ProjectGrid projects={projects} />);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 of 2 projects");
    await user.click(screen.getByRole("button", { name: "Backend" }));
    expect(screen.getByRole("heading", { name: "Library API" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Car Rental" })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Technology"), "React");
    expect(screen.getByText("No projects match these filters.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 of 2 projects");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Technology")).toHaveValue("All");
  });

  it("links the visual preview to the project and the case-study button to the study", () => {
    render(<ProjectGrid projects={projects} />);
    expect(screen.getByAltText("DriveEase car rental public home page")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Preview Car Rental" })).toHaveAttribute("href", "/projects/car-rental");
    expect(screen.getByRole("link", { name: "Read case study" })).toHaveAttribute("href", "/projects/car-rental#case-study");
  });
});
