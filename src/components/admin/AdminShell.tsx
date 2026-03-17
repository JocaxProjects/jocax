"use client";
// components/admin/AdminShell.tsx
//
// Client wrapper for the admin layout shell.
// ✦ Collapsible sidebar — 56px icon-only by default, 240px expanded
// ✦ Expands on hover OR when the toggle pin button is clicked
// ✦ Hides the global site header/footer via a className on <body>

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  const [pinned, setPinned] = useState(false);

  // Add/remove a body class so global CSS can hide site header/footer
  useEffect(() => {
    document.body.classList.add("admin-active");
    return () => document.body.classList.remove("admin-active");
  }, []);

  return (
    <>
      <style>{`
        /* Hide global site header and footer when admin is active */
        body.admin-active header:not(.admin-topbar),
        body.admin-active footer,
        body.admin-active nav.site-nav {
          display: none !important;
        }
        body.admin-active {
          padding-top: 0 !important;
          overflow-x: hidden;
        }

        /* ── Shell ── */
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #0a0a0b;
          color: #e8e8e8;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        /* ── Sidebar ── */
        .admin-sidebar-wrap {
          width: 56px;
          flex-shrink: 0;
          background: #111114;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; bottom: 0; left: 0;
          z-index: 50;
          overflow: hidden;
          transition: width 220ms cubic-bezier(0.4,0,0.2,1),
                      box-shadow 220ms ease;
        }
        .admin-sidebar-wrap:hover,
        .admin-sidebar-wrap.pinned {
          width: 240px;
          box-shadow: 4px 0 32px rgba(0,0,0,0.6);
        }

        /* ── Main content ── */
        .admin-main {
          flex: 1;
          margin-left: 56px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 220ms cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Topbar ── */
        .admin-topbar {
          height: 56px;
          background: rgba(17,17,20,0.92);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 1rem;
        }

        /* ── Content ── */
        .admin-content {
          flex: 1;
          padding: 2rem 1.5rem;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        /* ── Sidebar text/labels — hidden when collapsed ── */
        .admin-sidebar-wrap .nav-label,
        .admin-sidebar-wrap .logo-text,
        .admin-sidebar-wrap .section-label,
        .admin-sidebar-wrap .nav-footer-text {
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 180ms ease, max-width 180ms ease;
        }
        .admin-sidebar-wrap:hover .nav-label,
        .admin-sidebar-wrap:hover .logo-text,
        .admin-sidebar-wrap:hover .section-label,
        .admin-sidebar-wrap:hover .nav-footer-text,
        .admin-sidebar-wrap.pinned .nav-label,
        .admin-sidebar-wrap.pinned .logo-text,
        .admin-sidebar-wrap.pinned .section-label,
        .admin-sidebar-wrap.pinned .nav-footer-text {
          opacity: 1;
          max-width: 200px;
        }

        /* ── Pin button ── */
        .sidebar-pin-btn {
          position: absolute;
          top: 14px;
          right: 10px;
          width: 22px; height: 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 180ms ease;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
        }
        .admin-sidebar-wrap:hover .sidebar-pin-btn {
          opacity: 1;
        }
        .sidebar-pin-btn.active {
          background: rgba(232,160,32,0.15);
          border-color: rgba(232,160,32,0.3);
          color: #e8a020;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .admin-sidebar-wrap { width: 0; border: none; }
          .admin-sidebar-wrap:hover { width: 240px; }
          .admin-main { margin-left: 0; }
        }
      `}</style>

      <div className="admin-shell">
        {/* Sidebar wrapper handles hover expand */}
        <div className={`admin-sidebar-wrap${pinned ? " pinned" : ""}`}>
          <button
            className={`sidebar-pin-btn${pinned ? " active" : ""}`}
            onClick={() => setPinned(p => !p)}
            title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
          >
            {pinned ? "✕" : "📌"}
          </button>
          <AdminSidebar />
        </div>

        <div className="admin-main">
          <AdminTopbar userEmail={userEmail} />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </>
  );
}