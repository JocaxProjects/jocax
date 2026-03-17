// lib/admin-auth.ts
//
// Shared auth guard for all /api/admin/* routes.
//  ✦ LOCAL DEV (pgAdmin/PostgreSQL): reads a signed JWT from the
//    "admin_session" cookie, verifies it, then confirms ADMIN role in DB.
//  ✦ No @supabase/ssr dependency — works with plain Prisma + PostgreSQL.
//  ✦ Uses the built-in Node.js `crypto` module (no extra packages needed).
//    The JWT secret lives in process.env.ADMIN_JWT_SECRET.
//
// Usage: const auth = await requireAdmin(req); if (!auth.ok) return 401;

import { NextRequest } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production";

// ─── Minimal JWT helpers (HS256, no external deps) ────────────────────────────

function base64url(str: string) {
  return Buffer.from(str).toString("base64url");
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const expected = createHmac("sha256", SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (expected !== sigB64) return null; // Signature mismatch

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;

    return { userId: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

// ─── Exported helpers ─────────────────────────────────────────────────────────

/** Sign a session token — called by /api/auth/admin-login after password check */
export function signAdminToken(userId: string): string {
  const header  = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    sub:  userId,
    role: "ADMIN",
    iat:  Math.floor(Date.now() / 1000),
    exp:  Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  }));
  const sig = createHmac("sha256", SECRET).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

/** Guard for API route handlers — returns ok + userId or { ok: false } */
export async function requireAdmin(
  req: NextRequest
): Promise<{ ok: true; userId: string } | { ok: false }> {
  try {
    const cookie = req.cookies.get("admin_session");
    if (!cookie?.value) return { ok: false };

    const decoded = verifyToken(cookie.value);
    if (!decoded) return { ok: false };

    // Double-check role in DB (catches revoked admins)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") return { ok: false };
    return { ok: true, userId: decoded.userId };
  } catch {
    return { ok: false };
  }
}