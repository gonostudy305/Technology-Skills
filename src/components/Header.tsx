"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = ["Nen tang", "Tinh nang", "Nang cao", "Ung dung", "Viet Nam", "Cong dong"];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function isActive(linkPath: string): boolean {
    if (linkPath === "/") return pathname === "/";
    return pathname.startsWith(linkPath);
  }

  function handleToggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function handleSearchClick() {
    if (!isActive("/")) {
      router.push("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-[#f6f2ea]/95 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 rounded bg-sky-700 px-4 py-2 font-medium text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      >
        Skip to content
      </a>

      <div className="mx-auto h-16 w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-3">
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded px-1 py-1 text-zinc-900 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Tech Knowledge Base"
            >
              <span className="font-serif text-[2rem] font-semibold leading-none tracking-tight">Tech</span>
              <span className="rounded border border-orange-300 px-1.5 py-[1px] font-serif text-sm leading-none text-orange-500">vn</span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 lg:flex" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded px-1 py-1 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Ask AI
            </button>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Search"
              onClick={handleSearchClick}
            >
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg bg-[#c7662d] px-4 text-sm font-semibold text-white transition hover:bg-[#b35a26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Dang bai
            </button>

            <button
              type="button"
              className="rounded px-2 py-1 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Dang nhap
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:hidden"
            aria-label="Open navigation menu"
            onClick={handleToggleMobileMenu}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-zinc-200 bg-[#f6f2ea] px-4 py-4 sm:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium text-zinc-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700"
            >
              Ask AI
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-[#c7662d] px-3 py-2 text-sm font-semibold text-white"
            >
              Dang bai
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
