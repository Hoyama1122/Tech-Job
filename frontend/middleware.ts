import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value?.toLowerCase();
  const { pathname } = req.nextUrl;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }
  if (pathname.startsWith("/superadmin") && role !== "superadmin") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  if (pathname.startsWith("/supervisor") && role !== "supervisor") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  if (pathname.startsWith("/technician") && role !== "technician") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  if (pathname.startsWith("/executive") && role !== "executive") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/supervisor/:path*",
    "/technician/:path*",
    "/executive/:path*",
    "/superadmin/:path*",
  ],
};
