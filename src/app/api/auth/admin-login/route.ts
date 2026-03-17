// app/api/auth/admin-login/route.ts
//
// POST /api/auth/admin-login
//  ✦ Accepts { email, password } in JSON body
//  ✦ Looks up user in PostgreSQL via Prisma, verifies bcrypt password hash
//  ✦ Confirms role = 'ADMIN'
//  ✦ Signs a minimal JWT and sets it as an HttpOnly cookie ("admin_session")
//  ✦ No @supabase/ssr — works with plain PostgreSQL + Prisma
//
// To create the first admin user, run:
//   npx ts-node scripts/create-admin.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/admin-auth";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 422 });
  }

  const { email, password } = parsed.data;

  // Find user — passwordHash field must exist on your User model (add if missing)
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, passwordHash: true },
  });

  // Constant-time failure (prevents email enumeration)
  const dummyHash = "$2a$12$invalidhashfortimingnormalization000000000000000000000";
  const hashToCheck = user?.passwordHash ?? dummyHash;
  const valid = await bcrypt.compare(password, hashToCheck);

  if (!valid || !user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminToken(user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
    // secure: true — uncomment in production (requires HTTPS)
  });

  return res;
}