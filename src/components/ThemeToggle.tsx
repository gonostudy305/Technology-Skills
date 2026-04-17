"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "kb-theme";

type ThemeMode = "light" | "dark";

function getCurrentThemeMode(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getCurrentThemeMode());
    setMounted(true);
  }, []);

  function handleToggleTheme() {
    const root = document.documentElement;
    const nextTheme: ThemeMode = root.classList.contains("dark") ? "light" : "dark";

    root.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleToggleTheme}
      disabled={!mounted}
      className={`inline-flex h-9 items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${className}`}
    >
      <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />
      <span className="hidden md:inline">{isDark ? "Sang" : "Toi"}</span>
    </button>
  );
}
