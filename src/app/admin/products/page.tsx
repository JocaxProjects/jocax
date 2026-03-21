// app/admin/products/page.tsx

import { Fragment } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import ProductsTableActions from "@/components/admin/ProductsTableActions";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    page?: string; q?: string; category?: string;
    brand?: string; status?: string;
  }>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getProducts(params: Awaited<PageProps["searchParams"]>) {
  const page     = Math.max(1, Number(params.page ?? 1));
  const skip     = (page - 1) * PAGE_SIZE;
  const q        = params.q?.trim();
  const category = params.category;
  const brand    = params.brand;
  const status   = params.status;

  const where: Prisma.ProductWhereInput = {
    ...(q && { name: { contains: q, mode: "insensitive" } }),
    ...(category && { category: { slug: category } }),
    ...(brand && { brand: { slug: brand } }),
    ...(status === "active"   && { isActive: true }),
    ...(status === "inactive" && { isActive: false }),
  };

  const [products, total, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where, skip, take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, slug: true, price: true, currency: true,
        isActive: true, isFeatured: true, stockQuantity: true, sku: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
        brand:    { select: { name: true, slug: true } },
        images:   { select: { imageUrl: true }, take: 1, orderBy: { position: "asc" } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({    select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);

  return { products, total, categories, brands, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { products, total, categories, brands, page, totalPages } = await getProducts(resolvedParams);
  const q = resolvedParams.q ?? "";

  const fmt = (price: number | null, currency = "USD") =>
    price !== null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)
      : "—";

  return (
    <>
      <style>{`
        .prod-filters {
          display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center;
          margin-bottom: 1.25rem;
        }
        .prod-filter-input, .prod-filter-select {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; padding: 0.45rem 0.75rem;
          color: #e8e8e8; font-size: 0.8rem; outline: none;
          transition: border-color 140ms ease;
        }
        .prod-filter-input  { width: 220px; }
        .prod-filter-input:focus, .prod-filter-select:focus {
          border-color: rgba(232,160,32,0.45);
        }
        .prod-filter-select option { background: #111114; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .admin-table th {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.09em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          padding: 0 0.75rem 0.6rem; text-align: left; white-space: nowrap;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .admin-table td {
          padding: 0.7rem 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7); vertical-align: middle;
        }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
        .status-dot-active   { color: #34d399; }
        .status-dot-inactive { color: rgba(255,255,255,0.2); }
        .prod-thumb {
          width: 36px; height: 36px; border-radius: 5px; object-fit: cover;
          background: rgba(255,255,255,0.06);
        }
        .page-btn {
          padding: 0.4rem 0.85rem; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6); font-size: 0.78rem; font-weight: 600;
          text-decoration: none; transition: all 140ms ease; display: inline-block;
        }
        .page-btn:hover, .page-btn.current {
          background: rgba(232,160,32,0.12); border-color: rgba(232,160,32,0.3);
          color: #e8a020;
        }
        .page-btn.disabled { opacity: 0.3; pointer-events: none; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e8e8e8", marginBottom: "0.2rem" }}>Products</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{total.toLocaleString()} total</p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            background: "#e8a020", color: "#0a0a0b", fontWeight: 800,
            fontSize: "0.78rem", padding: "0.55rem 1.1rem", borderRadius: "7px",
            textDecoration: "none", letterSpacing: "0.04em",
          }}
        >
          + New Product
        </Link>
      </div>

      {/* ── Filters form ── */}
      <form method="GET" className="prod-filters">
        <input
          type="search" name="q" defaultValue={q}
          placeholder="Search products…"
          className="prod-filter-input"
          aria-label="Search products"
        />
        <select name="category" defaultValue={resolvedParams.category ?? ""} className="prod-filter-select">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="brand" defaultValue={resolvedParams.brand ?? ""} className="prod-filter-select">
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
        <select name="status" defaultValue={resolvedParams.status ?? ""} className="prod-filter-select">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" style={{
          background: "rgba(232,160,32,0.12)", border: "1px solid rgba(232,160,32,0.25)",
          borderRadius: "6px", padding: "0.45rem 1rem",
          color: "#e8a020", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
        }}>
          Filter
        </button>
        <Link href="/admin/products" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
          Reset
        </Link>
      </form>

      {/* ── Table ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)" }}>
                  No products found
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].imageUrl} alt="" className="prod-thumb" />
                    ) : (
                      <div className="prod-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📦</div>
                    )}
                    <div>
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        style={{ color: "#e8e8e8", fontWeight: 700, textDecoration: "none", display: "block", fontSize: "0.82rem" }}
                      >
                        {p.name}
                      </Link>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>/products/{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>{p.sku ?? "—"}</td>
                <td style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{p.category?.name ?? "—"}</td>
                <td style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{p.brand?.name    ?? "—"}</td>
                <td style={{ fontWeight: 700, color: "#e8a020" }}>{fmt(p.price, p.currency)}</td>
                <td style={{ color: p.stockQuantity <= 5 ? "#fbbf24" : "rgba(255,255,255,0.55)", fontWeight: p.stockQuantity <= 5 ? 700 : 400 }}>
                  {p.stockQuantity}
                </td>
                <td>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700 }}
                    className={p.isActive ? "status-dot-active" : "status-dot-inactive"}>
                    ● {p.isActive ? "Active" : "Draft"}
                  </span>
                </td>
                <td style={{ color: p.isFeatured ? "#e8a020" : "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>
                  {p.isFeatured ? "★ Yes" : "—"}
                </td>
                <td>
                  <ProductsTableActions productId={p.id} isActive={p.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <Link
            href={`?${new URLSearchParams({ ...resolvedParams, page: String(page - 1) })}`}
            className={`page-btn${page <= 1 ? " disabled" : ""}`}
          >
            ← Prev
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => Math.abs(n - page) <= 2 || n === 1 || n === totalPages)
            .map((n, idx, arr) => (
              <Fragment key={n}>
                {idx > 0 && arr[idx - 1] !== n - 1 && (
                  <span style={{ padding: "0.4rem 0.4rem", color: "rgba(255,255,255,0.2)" }}>…</span>
                )}
                <Link
                  href={`?${new URLSearchParams({ ...resolvedParams, page: String(n) })}`}
                  className={`page-btn${n === page ? " current" : ""}`}
                >
                  {n}
                </Link>
              </Fragment>
            ))}
          <Link
            href={`?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) })}`}
            className={`page-btn${page >= totalPages ? " disabled" : ""}`}
          >
            Next →
          </Link>
        </div>
      )}
    </>
  );
}