import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link 
              href="/privacy" 
              className="text-zinc-400 hover:text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-zinc-400 hover:text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
            >
              Terms
            </Link>
            <a 
              href="https://twitter.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 flex items-center justify-center"
              aria-label="X (formerly Twitter)"
            >
              <i className="fa-brands fa-x-twitter text-lg" aria-hidden="true"></i>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-zinc-500">
              &copy; {currentYear} TechBase Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
