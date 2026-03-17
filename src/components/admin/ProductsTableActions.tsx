"use client";
// components/admin/ProductsTableActions.tsx
//
// Row-level action buttons rendered inside the products table.
//  ✦ Edit button → navigates to /admin/products/[id]/edit
//  ✦ Toggle active/inactive via PATCH /api/admin/products/[id]
// Kept as a slim client component so the parent table stays a Server Component.
// No changes needed for Cloudinary — this component doesn't handle images.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  isActive:  boolean;
}

export default function ProductsTableActions({ productId, isActive }: Props) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
      <Link
        href={`/admin/products/${productId}/edit`}
        style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "5px", padding: "0.3rem 0.65rem", fontSize: "0.7rem",
          fontWeight: 600, color: "rgba(255,255,255,0.55)", textDecoration: "none",
          transition: "all 140ms ease",
        }}
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={toggleActive}
        disabled={loading}
        style={{
          background: isActive ? "rgba(248,113,113,0.08)" : "rgba(52,211,153,0.08)",
          border:     `1px solid ${isActive ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.2)"}`,
          borderRadius: "5px", padding: "0.3rem 0.65rem", fontSize: "0.7rem",
          fontWeight: 600, color: isActive ? "#f87171" : "#34d399",
          cursor: loading ? "not-allowed" : "pointer", transition: "all 140ms ease",
        }}
      >
        {loading ? "…" : isActive ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}