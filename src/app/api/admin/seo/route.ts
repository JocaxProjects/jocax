// app/api/admin/seo/route.ts
// POST /api/admin/seo — create a new SEO landing page

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  title:           z.string().min(5).max(70),
  slug:            z.string().min(2).regex(/^[a-z0-9-/]+$/),
  metaDescription: z.string().max(165).optional(),
  content:         z.string().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const existing = await prisma.seoPage.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const page = await prisma.seoPage.create({ data: parsed.data });
  return NextResponse.json(page, { status: 201 });
}