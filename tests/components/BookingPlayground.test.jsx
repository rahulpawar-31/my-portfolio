// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BookingPlayground from "@/components/BookingPlayground";

describe("Booking playground", () => {
  it("keeps a fractional discount and total consistent in the displayed breakdown", async () => {
    const user = userEvent.setup();
    const { container } = render(<BookingPlayground />);
    await user.click(screen.getByRole("radio", { name: "Hourly" }));
    const duration = screen.getByLabelText("Hours");
    await user.clear(duration);
    await user.type(duration, "1");
    await user.selectOptions(screen.getByLabelText("Coupon"), "welcome10");

    const breakdown = container.querySelector("dl");
    expect(within(breakdown).getByText("-₹22.50")).toBeInTheDocument();
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹1,738.50");
    const displayedAmounts = [...breakdown.querySelectorAll("dd")].map((item) => Number(item.textContent.replace(/[₹,]/g, "")));
    const total = displayedAmounts.pop();
    expect(displayedAmounts.reduce((sum, amount) => sum + amount, 0)).toBe(total);
  });

  it("recalculates as controls change, caps discounts, and resets without a network request", async () => {
    const user = userEvent.setup();
    const request = vi.spyOn(globalThis, "fetch");
    render(<BookingPlayground />);
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹5,748");
    await user.selectOptions(screen.getByLabelText("Coupon"), "welcome10");
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹5,323");
    await user.click(screen.getByRole("radio", { name: "Hourly" }));
    await user.selectOptions(screen.getByLabelText("Coupon"), "save500");
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹1,500");
    await user.click(screen.getByRole("radio", { name: "Airport" }));
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹1,760");
    await user.click(screen.getByRole("button", { name: "Reset demo" }));
    expect(screen.getByRole("radio", { name: "Daily" })).toBeChecked();
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹5,748");
    expect(request).not.toHaveBeenCalled();
  });

  it("replaces the quote with a useful validation message and recovers when corrected", async () => {
    const user = userEvent.setup();
    render(<BookingPlayground />);
    const duration = screen.getByLabelText("Days");
    await user.clear(duration);
    expect(duration).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("whole number from 1 to 30 days");
    expect(screen.queryByTestId("quote-total")).not.toBeInTheDocument();
    await user.type(duration, "1");
    await user.selectOptions(screen.getByLabelText("Vehicle"), "suv");
    expect(screen.getByTestId("quote-total")).toHaveTextContent("₹9,490");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
