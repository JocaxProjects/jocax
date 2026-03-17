// middleware.ts  (project root)
//
// Next.js middleware — protects all /admin/* routes.
//  ✦ Forwards x-pathname header on every request so app/layout.tsx can
//    detect admin routes and hide the global site header/footer
//  ✦ LOCAL DEV (pgAdmin/PostgreSQL): uses a simple signed session cookie.
//    No @supabase/ssr dependency — works with plain PostgreSQL + Prisma.
//  ✦ Full role verification (ADMIN check against the DB) happens inside
//    AdminLayout (server component) and each API route via requireAdmin().
//    Middleware only checks cookie presence for fast edge rejection.

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Forward pathname as a header so the root layout can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // Guard /admin/* routes
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get(SESSION_COOKIE);

    if (!session?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login-admin";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Exclude: API routes, static files, images, favicon
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};