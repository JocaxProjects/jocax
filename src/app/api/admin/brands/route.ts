// app/api/admin/brands/route.ts
// POST /api/admin/brands — create a new brand

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  name:    z.string().min(2),
  slug:    z.string().min(2).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const existing = await prisma.brand.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const brand = await prisma.brand.create({
    data: { ...parsed.data, logoUrl: parsed.data.logoUrl || null },
  });
  return NextResponse.json(brand, { status: 201 });
}