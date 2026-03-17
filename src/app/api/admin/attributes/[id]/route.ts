// app/api/admin/attributes/[id]/route.ts
// PATCH/DELETE /api/admin/attributes/[id]
// PATCH replaces all predefined values atomically when provided.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const updateSchema = z.object({
  name:   z.string().min(2).optional(),
  slug:   z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  type:   z.enum(["TEXT", "NUMBER", "BOOLEAN", "SELECT"]).optional(),
  unit:   z.string().optional().nullable(),
  values: z.array(z.object({ value: z.string().min(1) })).optional(),
});

interface Context { params: { id: string }; }

export async function PATCH(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });

  const { values, ...data } = parsed.data;

  const attribute = await prisma.$transaction(async (tx) => {
    if (values !== undefined) {
      await tx.attributeValue.deleteMany({ where: { attributeId: params.id } });
      if (values.length > 0) {
        await tx.attributeValue.createMany({
          data: values.map((v) => ({ attributeId: params.id, value: v.value })),
        });
      }
    }
    return tx.attribute.update({
      where: { id: params.id },
      data: { ...data, unit: data.unit ?? undefined },
      include: { values: true },
    });
  });

  return NextResponse.json(attribute);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Cascade: product_attributes removed by Prisma relation onDelete, values removed by onDelete Cascade
  await prisma.attribute.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}