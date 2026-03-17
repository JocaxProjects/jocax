// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic"; // ← add this

const schema = z.object({
  name:        z.string().min(2),
  slug:        z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  parentId:    z.string().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const category = await prisma.category.create({
    data: { ...parsed.data, parentId: parsed.data.parentId || null },
  });
  return NextResponse.json(category, { status: 201 });
}