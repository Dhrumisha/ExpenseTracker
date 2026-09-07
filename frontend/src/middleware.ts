import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { publicRoutes, ROUTES } from "@/admin-pages/routes";

/**
 * Check if route is public
 */
const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

/**
 * Decode JWT token and check if it's expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const decoded = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(decoded));

    if (!payload.exp) return true;

    const buffer = 60 * 1000; // 1 min
    return Date.now() >= payload.exp * 1000 - buffer;
  } catch {
    return true;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  
  // Allow internal Next.js files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Public share-report route
  if (/^\/admin\/stores\/[^/]+\/share-report$/.test(pathname)) {
    return NextResponse.next();
  }

  const isPublic = isPublicRoute(pathname);
  const hasValidSession = !!accessToken && !isTokenExpired(accessToken);

  // ---------------------------
  // PUBLIC ROUTES
  // ---------------------------
  if (isPublic) {
    // Redirect logged-in users away from sign-in
    if (pathname === ROUTES.auth.signIn && hasValidSession) {
      return NextResponse.redirect(
        new URL(ROUTES.admin.overview, req.url)
      );
    }
    return NextResponse.next();
  }

  // Every other route (including "/") requires a valid, non-expired
  // session. Previously a *missing* token (as opposed to an expired one)
  // fell through this check entirely and served protected pages
  // unauthenticated - e.g. /admin/overview rendered with no cookie at all.
  if (!hasValidSession) {
    return NextResponse.redirect(
      new URL(ROUTES.auth.signIn, req.url)
    );
  }

  // ---------------------------
  // ROOT HANDLING
  // ---------------------------
  if (pathname === ROUTES.root) {
    return NextResponse.redirect(
      new URL(ROUTES.admin.overview, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
