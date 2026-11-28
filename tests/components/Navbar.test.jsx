// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setTheme = vi.fn();
const usePathname = vi.fn();
const useTheme = vi.fn();

vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));
vi.mock("next-themes", () => ({ useTheme: () => useTheme() }));

const observerCallbacks = new Map();

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.disconnect = vi.fn();
  }
  observe(el) {
    observerCallbacks.set(el.id, this.callback);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const Navbar = (await import("@/components/Navbar")).default;

const activeClass = "text-yellow-400";

describe("Navbar", () => {
  beforeEach(() => {
    observerCallbacks.clear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    usePathname.mockReturnValue("/");
    useTheme.mockReturnValue({ theme: "dark", setTheme });
    window.scrollY = 0;
  });

  it("renders every navigation link", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/#experience");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/#projects");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
  });

  it("highlights the link matching the current pathname", () => {
    usePathname.mockReturnValue("/about");

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "About" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(activeClass);
  });

  it("highlights the link of the section currently in view", () => {
    const section = document.createElement("div");
    section.id = "projects";
    document.body.appendChild(section);

    render(<Navbar />);

    act(() => {
      observerCallbacks.get("projects")([{ isIntersecting: true }]);
    });

    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass(activeClass);

    section.remove();
  });

  it("highlights Home only while no section is in view", () => {
    const section = document.createElement("div");
    section.id = "experience";
    document.body.appendChild(section);

    render(<Navbar />);
    const home = screen.getByRole("link", { name: "Home" });
    const experience = screen.getByRole("link", { name: "Experience" });

    expect(home).toHaveClass(activeClass);
    expect(experience).not.toHaveClass(activeClass);

    act(() => observerCallbacks.get("experience")([{ isIntersecting: true }]));
    expect(home).not.toHaveClass(activeClass);
    expect(experience).toHaveClass(activeClass);

    act(() => observerCallbacks.get("experience")([{ isIntersecting: false }]));
    expect(home).toHaveClass(activeClass);
    expect(experience).not.toHaveClass(activeClass);

    section.remove();
  });

  it("highlights exactly one link when two sections are in view", () => {
    const ids = ["experience", "projects"];
    const els = ids.map((id) => {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
      return el;
    });

    render(<Navbar />);
    act(() => {
      observerCallbacks.get("experience")([{ isIntersecting: true }]);
      observerCallbacks.get("projects")([{ isIntersecting: true }]);
    });

    const active = screen.getAllByRole("link").filter((a) => a.classList.contains(activeClass));
    expect(active.map((a) => a.textContent)).toEqual(["Experience"]);

    act(() => observerCallbacks.get("experience")([{ isIntersecting: false }]));
    expect(screen.getByRole("link", { name: "Projects" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Experience" })).not.toHaveClass(activeClass);

    els.forEach((el) => el.remove());
  });

  it("tracks sections again after navigating to the home page from another page", () => {
    usePathname.mockReturnValue("/about");
    const { rerender } = render(<Navbar />);
    expect(observerCallbacks.has("experience")).toBe(false);

    const section = document.createElement("div");
    section.id = "experience";
    document.body.appendChild(section);
    usePathname.mockReturnValue("/");
    rerender(<Navbar />);

    act(() => observerCallbacks.get("experience")([{ isIntersecting: true }]));
    expect(screen.getByRole("link", { name: "Experience" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(activeClass);

    section.remove();
  });

  it("ignores sections that are not intersecting", () => {
    const section = document.createElement("div");
    section.id = "contact";
    document.body.appendChild(section);

    render(<Navbar />);

    act(() => {
      observerCallbacks.get("contact")([{ isIntersecting: false }]);
    });

    expect(screen.getByRole("link", { name: "Contact" })).not.toHaveClass(activeClass);

    section.remove();
  });

  it("adds the scrolled styling past 20px", () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector("nav");

    expect(nav.className).toContain("bg-black");
    expect(nav.className).not.toContain("backdrop-blur-md");

    window.scrollY = 21;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(nav.className).toContain("backdrop-blur-md");
  });

  it("switches from dark to light when the toggle is clicked", async () => {
    render(<Navbar />);

    const toggle = await screen.findByRole("button", { name: "Toggle dark mode" });
    expect(toggle).toHaveTextContent("☀️");

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("switches from light to dark when the toggle is clicked", async () => {
    useTheme.mockReturnValue({ theme: "light", setTheme });

    render(<Navbar />);

    const toggle = await screen.findByRole("button", { name: "Toggle dark mode" });
    expect(toggle).toHaveTextContent("🌙");

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("opens a mobile menu listing every link and closes it when a link is tapped", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = document.getElementById("mobile-menu");
    const menuLinks = [...menu.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")]);
    expect(menuLinks).toEqual([
      ["Home", "/"],
      ["About", "/about"],
      ["Experience", "/#experience"],
      ["Projects", "/#projects"],
      ["Contact", "/#contact"],
    ]);

    await user.click(menu.querySelector('a[href="/#projects"]'));

    expect(document.getElementById("mobile-menu")).toBeNull();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu on Escape and returns focus to the menu button", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const button = screen.getByRole("button", { name: "Menu" });
    await user.click(button);
    expect(document.getElementById("mobile-menu")).not.toBeNull();

    await user.keyboard("{Escape}");

    expect(document.getElementById("mobile-menu")).toBeNull();
    expect(button).toHaveFocus();
  });

  it("disconnects its observers on unmount", () => {
    const section = document.createElement("div");
    section.id = "projects";
    document.body.appendChild(section);
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Navbar />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    section.remove();
  });
});
