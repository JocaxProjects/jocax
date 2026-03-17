// app/admin/layout.tsx
//
// Root admin layout — wraps every /admin/* page.
//  ✦ Delegates shell rendering to AdminShell (client component)
//  ✦ AdminShell adds "admin-active" to <body> which hides the global header/footer
//  ✦ Collapsible sidebar: 56px icon-only, expands to 240px on hover or pin
//  ✦ LOCAL DEV: reads "admin_session" JWT cookie, verifies via Prisma (no Supabase)
//  ✦ Redirects unauthenticated users to /login-admin

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

const SECRET = process.env.ADMIN_JWT_SECRET ?? "dev-secret-change-in-production";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;

  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const expected = createHmac("sha256", SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");
    if (expected !== sigB64) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });

    if (!user || user.role !== "ADMIN") return null;
    return user;
  } catch {
    return null;
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/login-admin");

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}