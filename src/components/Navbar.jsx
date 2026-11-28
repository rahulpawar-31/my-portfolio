"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useScrolledPast } from "@/hooks/useScrolledPast";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#experience", label: "Experience", sectionId: "experience" },
  { href: "/#projects", label: "Projects", sectionId: "projects" },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
];

const sections = links.filter((l) => l.sectionId).map((l) => l.sectionId);

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-5 w-5">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const scrolled = useScrolledPast(20);
  // Sections currently in view, tagged with the page they were seen on so a
  // stale value from another page is never used.
  const [visible, setVisible] = useState({ path: null, ids: [] });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible((prev) => {
            const ids = prev.path === pathname ? prev.ids.filter((v) => v !== id) : [];
            return { path: pathname, ids: entry.isIntersecting ? [...ids, id] : ids };
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // The topmost section in view wins: it is the one the visitor is reading.
  const visibleIds = visible.path === pathname ? visible.ids : [];
  const activeSection = sections.find((id) => visibleIds.includes(id)) ?? "";

  const isActive = (href, sectionId) => {
    if (sectionId) return activeSection === sectionId;
    if (href === "/") return pathname === "/" && !activeSection;
    return pathname === href;
  };

  const navLink = (href, label, sectionId) => {
    const active = isActive(href, sectionId);

    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors relative group ${
          active ? "text-yellow-400" : "text-zinc-400 hover:text-white"
        }`}
      >
        {label}
        <span
          className={`absolute -bottom-1 left-0 h-px bg-yellow-400 transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-black"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight group">
          Rahul<span className="text-yellow-400 group-hover:text-yellow-300 transition-colors">.</span>dev
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label, sectionId }) => (
              <Fragment key={href}>{navLink(href, label, sectionId)}</Fragment>
            ))}

            <span className="w-px h-4 bg-zinc-700" />
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/5 bg-black">
          <ul className="max-w-6xl mx-auto px-6 py-2">
            {links.map(({ href, label, sectionId }) => {
              const active = isActive(href, sectionId);
              return (
                <li key={href} className="border-b border-white/5 last:border-b-0">
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 text-base font-medium transition-colors ${
                      active ? "text-yellow-400" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
