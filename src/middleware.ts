import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const session = (req as any).auth;
  const pathname = nextUrl.pathname;

  // If authenticated user hits the home page — redirect to their dashboard
  if (pathname === "/" && session?.user) {
    const role = session.user.role || (session.user as any).role;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    if (role === "TEACHER") return NextResponse.redirect(new URL("/teacher/schedule", nextUrl));
    return NextResponse.redirect(new URL("/cabinet/schedule", nextUrl));
  }

  // Public routes — always accessible
  if (
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/directions") ||
    pathname.startsWith("/schedule") ||
    pathname.startsWith("/prices") ||
    pathname.startsWith("/contacts") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/offer") ||
    pathname.startsWith("/consent") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/users/register"
  ) {
    return NextResponse.next();
  }

  // Protected routes: require authentication
  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role || (session.user as any).role;

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Teacher routes: accessible to teachers and admins
  if (pathname.startsWith("/teacher") && role !== "TEACHER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Client cabinet: only clients
  if (pathname.startsWith("/cabinet") && role !== "CLIENT") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    if (role === "TEACHER") return NextResponse.redirect(new URL("/teacher/schedule", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
