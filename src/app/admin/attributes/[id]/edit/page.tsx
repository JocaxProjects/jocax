// app/admin/attributes/[id]/edit/page.tsx
// Admin: edit an existing attribute and its predefined values.

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AttributeForm from "@/components/admin/AttributeForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params;
  const attribute = await prisma.attribute.findUnique({
    where: { id },
    select: {
      id: true, name: true, slug: true, type: true, unit: true,
      values: { select: { id: true, value: true }, orderBy: { value: "asc" } },
    },
  });
  if (!attribute) notFound();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/attributes" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← Attributes</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>{attribute.name}</h1>
      </div>
      <AttributeForm
        initialData={{
          ...attribute,
          unit: attribute.unit ?? undefined,
          type: attribute.type as "TEXT" | "NUMBER" | "BOOLEAN" | "SELECT",
          existingValues: attribute.values,
          values: attribute.values.map((v) => ({ value: v.value })),
        }}
      />
    </>
  );
}