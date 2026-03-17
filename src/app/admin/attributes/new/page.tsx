// app/admin/attributes/new/page.tsx
// Admin: create a new attribute.

import AttributeForm from "@/components/admin/AttributeForm";
import Link from "next/link";

export default function NewAttributePage() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <Link href="/admin/attributes" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>← Attributes</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#e8e8e8" }}>New Attribute</h1>
      </div>
      <AttributeForm />
    </>
  );
}