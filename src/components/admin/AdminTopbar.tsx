"use client";
// components/admin/AdminTopbar.tsx
//
// Sticky top bar rendered in admin layout.
//  ✦ Page title derived from pathname (breadcrumb-style)
//  ✦ Admin user email display + avatar initial
//  ✦ Sign-out: calls /api/auth/admin-logout which clears the session cookie

import { usePathname, useRouter } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/admin/dashboard":  "Dashboard",
  "/admin/products":   "Products",
  "/admin/categories": "Categories",
  "/admin/brands":     "Brands",
  "/admin/attributes": "Attributes",
  "/admin/seo":        "SEO Pages",
};

function resolveLabel(pathname: string): string {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  for (const [route, label] of Object.entries(ROUTE_LABELS)) {
    if (pathname.startsWith(route + "/")) {
      const rest = pathname.slice(route.length + 1);
      if (rest === "new")  return `New ${label.slice(0, -1)}`;
      if (rest === "edit") return `Edit ${label.slice(0, -1)}`;
      return label;
    }
  }
  return "Admin";
}

export default function AdminTopbar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const label    = resolveLabel(pathname);
  const initial  = userEmail?.[0]?.toUpperCase() ?? "A";

  const signOut = async () => {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/login-admin");
    router.refresh();
  };

  return (
    <>
      <style>{`
        .topbar-title {
          flex: 1; font-size: 0.875rem; font-weight: 700;
          letter-spacing: 0.05em; color: rgba(255,255,255,0.85);
        }
        .topbar-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #e8a020, #c47800);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 900; color: #0a0a0b;
          flex-shrink: 0;
        }
        .topbar-email {
          font-size: 0.72rem; color: rgba(255,255,255,0.35); font-weight: 500;
        }
        .topbar-signout {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 5px; padding: 0.3rem 0.75rem;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
          cursor: pointer; transition: all 140ms ease;
        }
        .topbar-signout:hover {
          background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.3);
          color: rgb(248,113,113);
        }
      `}</style>

      <header className="admin-topbar">
        <span className="topbar-title">{label}</span>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: "5px",
            padding: "0.3rem 0.7rem", textDecoration: "none",
            transition: "color 140ms ease, border-color 140ms ease",
          }}
        >
          View Site ↗
        </a>

        <div className="topbar-avatar" aria-hidden="true">{initial}</div>
        <span className="topbar-email">{userEmail}</span>
        <button className="topbar-signout" onClick={signOut} type="button">Sign out</button>
      </header>
    </>
  );
}