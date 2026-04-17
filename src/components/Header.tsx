"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = ["Học phần", "Simulation", "Case Studies", "Tài nguyên", "Cộng đồng UEL", "Về dự án"];

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
              aria-label="HTTT UEL Knowledge Base"
            >
              <span className="font-serif text-[2rem] font-semibold leading-none tracking-tight">HTTT</span>
              <span className="rounded border border-orange-300 px-1.5 py-[1px] font-serif text-sm leading-none text-orange-500">UEL</span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 lg:flex" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  href={item === "Học phần" ? "/hoc-phan" : "#"}
                  className="rounded px-1 py-1 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <ThemeToggle />

            <button
              type="button"
              className="inline-flex h-8 items-center whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-4 text-sm font-medium text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Cộng đồng
            </button>

            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Search"
              onClick={handleSearchClick}
            >
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </button>

            <Link
              href="/hoc-phan"
              className="inline-flex h-9 items-center whitespace-nowrap rounded-lg bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Xem Học Phần
            </Link>

            <button
              type="button"
              className="whitespace-nowrap rounded px-2 py-1 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Đóng góp
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 xl:hidden"
            aria-label="Open navigation menu"
            onClick={handleToggleMobileMenu}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-zinc-200 bg-[#f6f2ea] px-4 py-4 xl:hidden">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={item === "Học phần" ? "/hoc-phan" : "#"}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-center text-sm font-medium text-zinc-700 shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-zinc-200 pt-4">
            <ThemeToggle className="rounded-lg bg-white px-4 py-2 shadow-sm border border-zinc-200" />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm"
            >
              Cộng đồng
            </button>
            <Link
              href="/hoc-phan"
              className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-md active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Xem Học Phần
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
