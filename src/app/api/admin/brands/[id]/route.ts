// app/api/admin/brands/[id]/route.ts
// PATCH/DELETE /api/admin/brands/[id]

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  name:    z.string().min(2).optional(),
  slug:    z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
});

interface Context { params: { id: string }; }

export async function PATCH(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  if (parsed.data.slug) {
    const conflict = await prisma.brand.findFirst({ where: { slug: parsed.data.slug, NOT: { id: params.id } } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const brand = await prisma.brand.update({
    where: { id: params.id },
    data: { ...parsed.data, logoUrl: parsed.data.logoUrl || null },
  });
  return NextResponse.json(brand);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.updateMany({ where: { brandId: params.id }, data: { brandId: null } });
  await prisma.brand.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}