// app/api/admin/categories/[id]/route.ts
// PATCH /api/admin/categories/[id] — update category
// DELETE /api/admin/categories/[id] — delete category (products become uncategorized)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  name:        z.string().min(2).optional(),
  slug:        z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  parentId:    z.string().optional().nullable(),
});

interface Context { params: Promise<{ id: string }>; }

export async function PATCH(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const { id } = await params;

  if (parsed.data.slug) {
    const conflict = await prisma.category.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const category = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}