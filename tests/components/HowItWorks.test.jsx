// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HowItWorksProvider, HowItWorksToggle, FeatureExplanation } from "@/components/HowItWorks";
import Contact from "@/components/Contact";

function Tour({ feature = "projects" }) {
  return (
    <HowItWorksProvider>
      <HowItWorksToggle />
      <FeatureExplanation feature={feature} />
    </HowItWorksProvider>
  );
}

describe("How this works mode", () => {
  it("keeps explanations out of the default portfolio", () => {
    const { container } = render(<Tour />);

    expect(screen.getByRole("switch", { name: "How this works" })).not.toBeChecked();
    expect(container.querySelector("details")).toBeNull();
    expect(screen.queryByText("How the project gallery works")).not.toBeInTheDocument();
  });

  it("supports the keyboard and expands a note with a source link", async () => {
    const user = userEvent.setup();
    const { container } = render(<Tour />);

    await user.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await user.keyboard(" ");

    expect(screen.getByRole("switch")).toBeChecked();
    const details = container.querySelector("details");
    expect(details).not.toHaveAttribute("open");
    await user.click(screen.getByText("How the project gallery works"));
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("Read from the database")).toBeVisible();
    const source = screen.getByRole("link", { name: /read the project gallery code/i });
    expect(source).toHaveAttribute("href", "https://github.com/rahulpawar-31/my-portfolio/blob/main/src/components/Project.jsx");
    expect(source).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps the mode enabled when page content changes and hides all notes when disabled", async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(<Tour />);
    await user.click(screen.getByRole("switch"));

    rerender(<Tour feature="views" />);
    expect(screen.getByRole("switch")).toBeChecked();
    expect(screen.getByText("How project views are counted")).toBeInTheDocument();
    expect(screen.queryByText("How the project gallery works")).not.toBeInTheDocument();

    await user.click(screen.getByRole("switch"));
    expect(container.querySelector("details")).toBeNull();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("reveals each feature explanation together", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <HowItWorksProvider>
        <HowItWorksToggle />
        {["projects", "contact", "activity", "readme", "views"].map((feature) => (
          <FeatureExplanation key={feature} feature={feature} />
        ))}
      </HowItWorksProvider>
    );

    await user.click(screen.getByRole("switch"));
    expect(container.querySelectorAll("details")).toHaveLength(5);
    await user.click(screen.getByRole("switch"));
    expect(container.querySelectorAll("details")).toHaveLength(0);
  });

  it("lets visitors inspect the contact flow and still submit the form", async () => {
    const user = userEvent.setup();
    const request = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    render(
      <HowItWorksProvider>
        <HowItWorksToggle />
        <Contact />
      </HowItWorksProvider>
    );

    await user.click(screen.getByRole("switch"));
    await user.click(screen.getByText("How the contact form works"));
    expect(screen.getByText("Save before sending")).toBeVisible();
    expect(request).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText("Your name"), "Ada");
    await user.type(screen.getByPlaceholderText("Your email"), "ada@example.com");
    await user.type(screen.getByPlaceholderText("Tell me about your project or question..."), "Hello Rahul");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    expect(request).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeChecked();
  });
});
