"use client";
// components/admin/BrandRowActions.tsx
// Row-level Edit / Delete actions for the brands table.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandRowActions({ brandId }: { brandId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this brand?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/brands/${brandId}`, { method: "DELETE" });
      router.refresh();
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <Link href={`/admin/brands/${brandId}/edit`} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", padding: "0.3rem 0.65rem", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Edit</Link>
      <button type="button" onClick={handleDelete} disabled={loading} style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "5px", padding: "0.3rem 0.65rem", fontSize: "0.7rem", fontWeight: 600, color: "#f87171", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "…" : "Delete"}
      </button>
    </div>
  );
}