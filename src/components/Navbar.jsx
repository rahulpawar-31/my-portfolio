"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useScrolledPast } from "@/hooks/useScrolledPast";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const scrolled = useScrolledPast(20);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["projects", "contact"];
    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const navLink = (href, label, sectionId) => {
    const isPage = pathname === href;
    const isSection = sectionId ? activeSection === sectionId : false;
    const active = isPage || isSection;

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

        <div className="flex items-center gap-6">
          {navLink("/", "Home")}
          {navLink("/about", "About")}
          {navLink("/#projects", "Projects", "projects")}
          {navLink("/#contact", "Contact", "contact")}

          <span className="w-px h-4 bg-zinc-700" />

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
