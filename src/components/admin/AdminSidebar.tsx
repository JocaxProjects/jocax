"use client";
// components/admin/AdminSidebar.tsx
//
// Fixed sidebar navigation for the admin panel.
//  ✦ Section-grouped nav with icons and active-state detection via usePathname
//  ✦ Collapsible sections for dense nav trees
//  ✦ Brand logo at top, version badge at bottom

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: "◈", label: "Dashboard" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", icon: "▦", label: "Products" },
      { href: "/admin/categories", icon: "◫", label: "Categories" },
      { href: "/admin/brands", icon: "◉", label: "Brands" },
      { href: "/admin/attributes", icon: "◧", label: "Attributes" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/seo", icon: "◎", label: "SEO Pages" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .admin-nav-logo {
          padding: 1.25rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 0.6rem;
        }
        .admin-nav-logo-mark {
          width: 28px; height: 28px; border-radius: 6px;
          background: linear-gradient(135deg, #e8a020, #c47800);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 900; color: #0a0a0b;
          flex-shrink: 0;
        }
        .admin-nav-logo-text {
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: #e8e8e8; line-height: 1.1;
        }
        .admin-nav-logo-sub {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
        }
        .admin-nav-section { padding: 1rem 0.75rem 0.25rem; }
        .admin-nav-section-label {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          padding: 0 0.5rem; margin-bottom: 0.35rem;
        }
        .admin-nav-item {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.5rem 0.75rem; border-radius: 6px;
          font-size: 0.8rem; font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-decoration: none; transition: all 140ms ease;
          cursor: pointer; margin-bottom: 1px;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.85);
        }
        .admin-nav-item.active {
          background: rgba(232,160,32,0.12);
          color: #e8a020; font-weight: 700;
        }
        .admin-nav-item-icon {
          width: 18px; text-align: center;
          font-size: 0.85rem; flex-shrink: 0;
        }
        .admin-nav-footer {
          margin-top: auto; padding: 1rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.65rem; color: rgba(255,255,255,0.2);
          font-weight: 500; letter-spacing: 0.06em;
        }
      `}</style>

      <nav className="admin-sidebar" aria-label="Admin navigation">
        {/* Logo */}
        <div className="admin-nav-logo">
          <div className="admin-nav-logo-mark">J</div>
          <div>
            <div className="admin-nav-logo-text">Jocax</div>
            <div className="admin-nav-logo-sub">Admin Panel</div>
          </div>
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "1rem" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <div className="admin-nav-section-label">{section.label}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item${isActive ? " active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="admin-nav-item-icon" aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="admin-nav-footer">v1.0.0 · Jocax Solutions Limited</div>
      </nav>
    </>
  );
}