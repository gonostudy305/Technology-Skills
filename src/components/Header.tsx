"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
  }

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 font-medium rounded shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 z-50"
      >
        Skip to main content
      </a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-zinc-900 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1"
              aria-label="Home"
            >
              <i className="fa-solid fa-book-open-reader text-xl" aria-hidden="true"></i>
              <span className="font-bold text-xl tracking-tight">TechBase</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main Navigation">
            <Link 
              href="/" 
              className="text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
            >
              Categories
            </Link>

            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
              <button
                type="button"
                className="flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Resources
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-md shadow-lg py-1 z-50 origin-top-right transition-opacity"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link 
                    href="/guides" 
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 focus-visible:bg-zinc-50 focus-visible:text-indigo-600 focus-visible:outline-none"
                    role="menuitem"
                  >
                    Guides
                  </Link>
                  <Link 
                    href="/api-reference" 
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 focus-visible:bg-zinc-50 focus-visible:text-indigo-600 focus-visible:outline-none"
                    role="menuitem"
                  >
                    API Reference
                  </Link>
                  <Link 
                    href="/community" 
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 focus-visible:bg-zinc-50 focus-visible:text-indigo-600 focus-visible:outline-none"
                    role="menuitem"
                  >
                    Community
                  </Link>
                </div>
              )}
            </div>

            {/* Icon Button */}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full p-2"
              aria-label="GitHub Repository"
            >
              <i className="fa-brands fa-github text-xl" aria-hidden="true"></i>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
