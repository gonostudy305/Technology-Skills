import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCanonicalArticlePath } from "./src/lib/subjects";

const LEGACY_ARTICLE_PATTERN = /^\/articles\/([^/]+)\/?$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(LEGACY_ARTICLE_PATTERN);

  if (!match) {
    return NextResponse.next();
  }

  const legacySlug = decodeURIComponent(match[1]);
  const canonicalPath = getCanonicalArticlePath(legacySlug);

  if (!canonicalPath) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = canonicalPath;

  // Permanent redirect for SEO canonicalization.
  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/articles/:slug*"],
};
