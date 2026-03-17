// app/api/auth/admin-logout/route.ts
//
// POST /api/auth/admin-logout
//  ✦ Clears the "admin_session" HttpOnly cookie
//  ✦ Called by the AdminTopbar sign-out button

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   0, // Immediately expires the cookie
  });
  return res;
}