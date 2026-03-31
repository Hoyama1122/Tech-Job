import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value?.toLowerCase();
  const { pathname } = req.nextUrl;

  // Protect all routes except /login, /api, static files, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Redirect to login if accessing root
  if (pathname === "/") {
    if (token && role) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Handle Login Route
  if (pathname.startsWith("/login")) {
    if (token && role) {
      // already logged in, redirect to dashboard based on role
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
    return NextResponse.next(); // Go to login page
  }

  // Unauthenticated users accessing protected routes
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role verification on protected routes
  const protectedRoles = ["admin", "superadmin", "supervisor", "technician", "executive"];
  for (const pRole of protectedRoles) {
    if (pathname.startsWith(`/${pRole}`) && role !== pRole) {
      // They are not allowed on this dashboard, redirect to their actual dashboard
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
