// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "@/components/Contact";

const fill = async (user) => {
  await user.type(screen.getByPlaceholderText("Your name"), "Ada");
  await user.type(screen.getByPlaceholderText("Your email"), "ada@example.com");
  await user.type(
    screen.getByPlaceholderText("Tell me about your project or question..."),
    "Hello"
  );
};

describe("Contact", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("submits the form data to the contact API", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<Contact />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
      company: "",
    });
  });

  it("clears the fields and confirms on success", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<Contact />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your email")).toHaveValue("");
  });

  it("shows an error when the API rejects the message", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Failed to send your message" }),
    });

    render(<Contact />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/failed to send your message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toHaveValue("Ada");
  });

  it("shows an error when the request throws", async () => {
    const user = userEvent.setup();
    fetch.mockRejectedValue(new Error("offline"));

    render(<Contact />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/offline/i)).toBeInTheDocument();
  });

  it("disables the button while sending", async () => {
    const user = userEvent.setup();
    let resolveFetch;
    fetch.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));

    render(<Contact />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const button = await screen.findByRole("button", { name: /sending/i });
    expect(button).toBeDisabled();

    resolveFetch({ ok: true, json: async () => ({}) });
    await waitFor(() => expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled());
  });
});
