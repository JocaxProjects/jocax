// app/admin/attributes/page.tsx
//
// Admin attributes index — lists all filterable attributes with their value counts.
//  ✦ Attributes define the filter facets (brand, power, voltage, capacity, etc.)
//  ✦ Each attribute has a type (TEXT, NUMBER, BOOLEAN, SELECT) and optional unit
//  ✦ Clicking an attribute shows its predefined values

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AttributeRowActions from "@/components/admin/AttributeRowActions";

export default async function AdminAttributesPage() {
  const attributes = await prisma.attribute.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, slug: true, type: true, unit: true,
      _count: { select: { values: true, productAttributes: true } },
    },
  });

  const TYPE_COLOR: Record<string, string> = {
    TEXT:    "rgba(96,165,250,0.15)",
    NUMBER:  "rgba(52,211,153,0.15)",
    BOOLEAN: "rgba(251,191,36,0.15)",
    SELECT:  "rgba(167,139,250,0.15)",
  };
  const TYPE_TEXT: Record<string, string> = {
    TEXT: "#60a5fa", NUMBER: "#34d399", BOOLEAN: "#fbbf24", SELECT: "#a78bfa",
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e8e8e8", marginBottom: "0.2rem" }}>Attributes</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{attributes.length} attributes · define filter facets</p>
        </div>
        <Link href="/admin/attributes/new" style={{ background: "#e8a020", color: "#0a0a0b", fontWeight: 800, fontSize: "0.78rem", padding: "0.55rem 1.1rem", borderRadius: "7px", textDecoration: "none" }}>
          + New Attribute
        </Link>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {["Name", "Slug", "Type", "Unit", "Predefined Values", "Used on Products", "Actions"].map((h) => (
                <th key={h} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", padding: "0 0.75rem 0.6rem", textAlign: "left", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)" }}>No attributes yet</td></tr>
            )}
            {attributes.map((attr) => (
              <tr key={attr.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <Link href={`/admin/attributes/${attr.id}/edit`} style={{ color: "#e8e8e8", fontWeight: 700, textDecoration: "none" }}>{attr.name}</Link>
                </td>
                <td style={{ padding: "0.7rem 0.75rem", fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{attr.slug}</td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <span style={{ background: TYPE_COLOR[attr.type] ?? "rgba(255,255,255,0.06)", color: TYPE_TEXT[attr.type] ?? "#e8e8e8", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.2rem 0.55rem", borderRadius: "99px" }}>
                    {attr.type}
                  </span>
                </td>
                <td style={{ padding: "0.7rem 0.75rem", color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{attr.unit ?? "—"}</td>
                <td style={{ padding: "0.7rem 0.75rem", color: attr._count.values > 0 ? "#e8a020" : "rgba(255,255,255,0.25)", fontWeight: attr._count.values > 0 ? 700 : 400 }}>{attr._count.values}</td>
                <td style={{ padding: "0.7rem 0.75rem", color: "rgba(255,255,255,0.45)" }}>{attr._count.productAttributes}</td>
                <td style={{ padding: "0.7rem 0.75rem" }}>
                  <AttributeRowActions attributeId={attr.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}