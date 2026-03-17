// app/admin/dashboard/page.tsx
//
// Admin dashboard overview — the first screen after login.
//  ✦ KPI stat cards: total products, categories, brands, active listings
//  ✦ Recent products table (last 10 created)
//  ✦ Quick-action buttons to create new records
//  ✦ Low-stock alert list
//  All data fetched server-side via Prisma for zero client waterfall.

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getDashboardData() {
  const [
    totalProducts,
    activeProducts,
    totalCategories,
    totalBrands,
    recentProducts,
    lowStockProducts,
    featuredCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, slug: true, price: true,
        currency: true, isActive: true, stockQuantity: true, createdAt: true,
        category: { select: { name: true } },
        brand:    { select: { name: true } },
      },
    }),
    prisma.product.findMany({
      where: { stockQuantity: { gt: 0, lte: 5 }, isActive: true },
      take: 8,
      orderBy: { stockQuantity: "asc" },
      select: { id: true, name: true, slug: true, stockQuantity: true },
    }),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);

  return { totalProducts, activeProducts, totalCategories, totalBrands, recentProducts, lowStockProducts, featuredCount };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div style={{
      background:   "rgba(255,255,255,0.03)",
      border:       `1px solid ${accent ? "rgba(232,160,32,0.25)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "10px",
      padding:      "1.25rem 1.5rem",
    }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: accent ? "#e8a020" : "#e8e8e8", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.4rem", fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const fmt = (price: number | null, currency = "USD") =>
    price !== null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)
      : "—";

  return (
    <>
      <style>{`
        .dash-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .dash-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 0.75rem;
        }
        .dash-section-title {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
        }
        .dash-table {
          width: 100%; border-collapse: collapse; font-size: 0.8rem;
        }
        .dash-table th {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          padding: 0 0.75rem 0.6rem; text-align: left; white-space: nowrap;
        }
        .dash-table td {
          padding: 0.65rem 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75); vertical-align: middle;
        }
        .dash-table tr:hover td { background: rgba(255,255,255,0.02); }
        .status-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.2rem 0.55rem; border-radius: 99px;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .status-active   { background: rgba(52,211,153,0.1); color: #34d399; }
        .status-inactive { background: rgba(248,113,113,0.1); color: #f87171; }
        .quick-action-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.1rem; border-radius: 7px;
          background: rgba(232,160,32,0.1); border: 1px solid rgba(232,160,32,0.25);
          color: #e8a020; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.04em; text-decoration: none;
          transition: all 140ms ease;
        }
        .quick-action-btn:hover { background: rgba(232,160,32,0.18); border-color: rgba(232,160,32,0.5); }
        .low-stock-chip {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.55rem 0.75rem; border-radius: 6px;
          background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.12);
          font-size: 0.78rem; color: rgba(255,255,255,0.7);
          text-decoration: none; transition: all 140ms ease;
        }
        .low-stock-chip:hover { background: rgba(251,191,36,0.1); }
      `}</style>

      {/* ── KPI cards ── */}
      <div className="dash-grid-4">
        <StatCard label="Total Products"  value={data.totalProducts}                                          />
        <StatCard label="Active Listings" value={data.activeProducts}  sub={`${data.totalProducts - data.activeProducts} inactive`} accent />
        <StatCard label="Categories"      value={data.totalCategories}                                        />
        <StatCard label="Brands"          value={data.totalBrands}                                            />
        <StatCard label="Featured"        value={data.featuredCount}   sub="on homepage carousel"             />
        <StatCard label="Low Stock"       value={data.lowStockProducts.length} sub="≤ 5 units remaining"      />
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
        <Link href="/admin/products/new"   className="quick-action-btn">+ New Product</Link>
        <Link href="/admin/categories/new" className="quick-action-btn">+ New Category</Link>
        <Link href="/admin/brands/new"     className="quick-action-btn">+ New Brand</Link>
        <Link href="/admin/attributes/new" className="quick-action-btn">+ New Attribute</Link>
        <Link href="/admin/seo/new"        className="quick-action-btn">+ New SEO Page</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Recent products ── */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div className="dash-section-header" style={{ padding: "1rem 1.25rem 0.75rem", marginBottom: 0 }}>
            <span className="dash-section-title">Recent Products</span>
            <Link href="/admin/products" style={{ fontSize: "0.72rem", color: "#e8a020", fontWeight: 600 }}>View all →</Link>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}/edit`} style={{ color: "#e8e8e8", fontWeight: 600, textDecoration: "none" }}>
                      {p.name}
                    </Link>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.4)" }}>{p.category?.name ?? "—"}</td>
                  <td style={{ fontWeight: 700, color: "#e8a020" }}>{fmt(p.price, p.currency)}</td>
                  <td style={{ color: p.stockQuantity <= 5 ? "#fbbf24" : "rgba(255,255,255,0.55)" }}>
                    {p.stockQuantity}
                  </td>
                  <td>
                    <span className={`status-badge ${p.isActive ? "status-active" : "status-inactive"}`}>
                      {p.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                    {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Low stock ── */}
        {data.lowStockProducts.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <div className="dash-section-header">
              <span className="dash-section-title">⚠ Low Stock</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.lowStockProducts.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="low-stock-chip">
                  <span style={{ fontWeight: 600, fontSize: "0.78rem" }}>{p.name}</span>
                  <span style={{ fontWeight: 800, color: "#fbbf24", fontSize: "0.78rem" }}>
                    {p.stockQuantity} left
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}