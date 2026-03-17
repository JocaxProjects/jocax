// app/api/admin/seo/[id]/route.ts
// PATCH/DELETE /api/admin/seo/[id]

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  title:           z.string().min(5).max(70).optional(),
  slug:            z.string().min(2).regex(/^[a-z0-9-/]+$/).optional(),
  metaDescription: z.string().max(165).optional().nullable(),
  content:         z.string().optional().nullable(),
});

interface Context { params: { id: string }; }

export async function PATCH(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  if (parsed.data.slug) {
    const conflict = await prisma.seoPage.findFirst({ where: { slug: parsed.data.slug, NOT: { id: params.id } } });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const page = await prisma.seoPage.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(page);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.seoPage.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}