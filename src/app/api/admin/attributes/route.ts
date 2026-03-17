// app/api/admin/attributes/route.ts
// POST /api/admin/attributes — create a new attribute with optional predefined values

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  name:   z.string().min(2),
  slug:   z.string().min(2).regex(/^[a-z0-9-]+$/),
  type:   z.enum(["TEXT", "NUMBER", "BOOLEAN", "SELECT"]),
  unit:   z.string().optional(),
  values: z.array(z.object({ value: z.string().min(1) })).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const existing = await prisma.attribute.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const { values, ...data } = parsed.data;
  const attribute = await prisma.attribute.create({
    data: {
      ...data,
      unit: data.unit || null,
      values: values?.length ? { create: values.map((v) => ({ value: v.value })) } : undefined,
    },
    include: { values: true },
  });
  return NextResponse.json(attribute, { status: 201 });
}