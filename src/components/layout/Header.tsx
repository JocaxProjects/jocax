"use client";

// components/layout/Header.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ENHANCED: Fully leverages globals.css design tokens for every property.
// MOBILE-FIRST: Base styles target mobile, overrides scale up to tablet/desktop.
// RESPONSIVE: XS(320) → SM(480) → MD(768) → LG(1024) → XL(1280) → 2XL(1536)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",           label: "Home"       },
  { href: "/products",   label: "Catalog"    },
  { href: "/categories", label: "Categories" },
  { href: "/search",     label: "Search"     },
  { href: "/about",      label: "About"      },
  { href: "/contact",    label: "Contact"    },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname                    = usePathname();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef                   = useRef<HTMLInputElement>(null);
  const mobileSearchRef             = useRef<HTMLInputElement>(null);
  const prevPathnameRef             = useRef(pathname);
  const menuButtonRef               = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      const id = setTimeout(() => {
        setMenuOpen(false);
        setSearchOpen(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) menuButtonRef.current?.focus();
  }, [menuOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMenuOpen(false);
      setSearchOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* ── Skip to content — globals.css .skip-to-content ── */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* ════════════════════════════════════════════════════════════════
          NAV BAR
      ════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className={`jx-header${scrolled || menuOpen ? " jx-header--scrolled" : ""}`}
      >
        <div className="container jx-header__inner">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link href="/" aria-label="Jocax Solutions — home" className="jx-logo">
            JOCAX<span className="jx-logo__dot">.</span>
          </Link>

          {/* ── Desktop inline search ─────────────────────────────────── */}
          <div className="jx-search-desktop" role="search" aria-label="Site search">
            <span className="jx-search-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor"/>
              </svg>
            </span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search equipment…"
              aria-label="Search equipment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="jx-search-input"
            />
          </div>

          {/* ── Desktop nav ──────────────────────────────────────────── */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="jx-nav-desktop"
          >
            <ul role="list" className="jx-nav-list">
              {NAV_LINKS.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`jx-nav-link${active ? " jx-nav-link--active" : ""}`}
                    >
                      {label}
                      {active && <span className="jx-nav-link__pip" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/contact" className="btn btn-primary btn-sm">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── Mobile controls ──────────────────────────────────────── */}
          <div className="jx-mobile-controls" aria-label="Mobile menu controls">
            {/* Search toggle */}
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="mobile-search-panel"
              onClick={() => setSearchOpen((o) => !o)}
              className={`jx-icon-btn${searchOpen ? " jx-icon-btn--active" : ""}`}
            >
              {searchOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
                  <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor"/>
                </svg>
              )}
            </button>

            {/* Hamburger */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className={`jx-hamburger${menuOpen ? " jx-hamburger--open" : ""}`}
            >
              <span className="jx-hamburger__bar jx-hamburger__bar--top"    aria-hidden="true" />
              <span className="jx-hamburger__bar jx-hamburger__bar--mid"    aria-hidden="true" />
              <span className="jx-hamburger__bar jx-hamburger__bar--bottom" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Mobile search panel ──────────────────────────────────────── */}
        <div
          id="mobile-search-panel"
          role="search"
          aria-label="Site search"
          className={`jx-search-mobile${searchOpen ? " jx-search-mobile--open" : ""}`}
        >
          <div className="jx-search-mobile__inner">
            <div className="jx-search-mobile__field">
              <span className="jx-search-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor"/>
                </svg>
              </span>
              <input
                ref={mobileSearchRef}
                type="search"
                placeholder="Search equipment…"
                aria-label="Search equipment"
                tabIndex={searchOpen ? 0 : -1}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="jx-search-input jx-search-input--mobile"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="jx-search-clear"
                  onClick={() => { setSearchQuery(""); mobileSearchRef.current?.focus(); }}
                  tabIndex={searchOpen ? 0 : -1}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className={`jx-drawer${menuOpen ? " jx-drawer--open" : ""}`}
      >
        {/* Ambient glow */}
        <div className="jx-drawer__glow" aria-hidden="true" />

        <nav aria-label="Mobile navigation" className="jx-drawer__nav">

          {/* Section label — .eyebrow-light from globals.css */}
          <p className="eyebrow-light jx-drawer__eyebrow">Navigation</p>

          <ul role="list" className="jx-drawer__list">
            {NAV_LINKS.map(({ href, label }, i) => {
              const active = isActive(pathname, href);
              return (
                <li
                  key={href}
                  className={`jx-drawer__item${menuOpen ? " jx-drawer__item--animate" : ""}`}
                  style={{ animationDelay: menuOpen ? `${i * 55}ms` : "0ms" }}
                >
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    className={`jx-drawer__link${active ? " jx-drawer__link--active" : ""}`}
                  >
                    <span className="jx-drawer__link-text">{label}</span>
                    <span className="jx-drawer__link-arrow" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA card */}
          <div className="jx-drawer__cta">
            <p className="eyebrow-light jx-drawer__cta-eyebrow">
              Ready to equip your kitchen?
            </p>
            <p className="jx-drawer__cta-body">
              Get expert advice and fast pricing from our team.
            </p>
            <Link
              href="/contact"
              tabIndex={menuOpen ? 0 : -1}
              className="btn btn-primary jx-drawer__cta-btn"
            >
              Get a Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="jx-drawer__footer">
          <span className="jx-drawer__footer-logo">
            JOCAX<span className="jx-logo__dot">.</span>
          </span>
          <small className="jx-drawer__footer-copy">
            © {new Date().getFullYear()} Jocax Solutions Limited
          </small>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className="jx-backdrop"
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          STYLES — fully token-driven from globals.css
          Mobile-first: base = mobile, media queries scale up
      ════════════════════════════════════════════════════════════════ */}
      <style>{`

        /* ── HEADER ROOT ───────────────────────────────────────────────
           Uses --nav-height-mobile on mobile, --nav-height on desktop.
           CSS custom property overridden in globals.css at <768px already.
        ── */
        .jx-header {
          position:             fixed;
          inset:                0 0 auto 0;
          height:               var(--nav-height-mobile);  /* 3.5rem mobile */
          z-index:              var(--z-sticky);
          background:           rgba(13, 13, 13, 0.82);
          backdrop-filter:      blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom:        1px solid rgba(232, 160, 32, 0.08);
          transition:
            background      var(--transition-base),
            border-color    var(--transition-base),
            height          var(--transition-base);
          will-change:          background, border-color;
        }
        .jx-header--scrolled {
          background:    rgba(13, 13, 13, 0.98);
          border-bottom: 1px solid rgba(232, 160, 32, 0.22);
          box-shadow:    var(--shadow-lg);
        }

        /* ── HEADER INNER ── */
        .jx-header__inner {
          height:         100%;
          display:        flex;
          align-items:    center;
          justify-content:space-between;
          gap:            var(--space-3);
        }

        /* ── LOGO ─────────────────────────────────────────────────────
           Uses --font-display, --color-white, --color-amber from tokens.
        ── */
        .jx-logo {
          font-family:    var(--font-display);
          font-weight:    900;
          /* Fluid: 1.05rem (mobile) → 1.35rem (desktop) */
          font-size:      clamp(1.05rem, 2.5vw, 1.35rem);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color:          var(--color-white);
          flex-shrink:    0;
          line-height:    var(--leading-none);
          text-decoration:none;
          display:        inline-flex;
          align-items:    baseline;
          gap:            1px;
          transition:     opacity var(--transition-fast);
        }
        .jx-logo:hover  { opacity: 0.85; }
        .jx-logo:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }
        .jx-logo__dot { color: var(--color-amber); }

        /* ── DESKTOP SEARCH (hidden mobile, shown ≥1024px) ─────────── */
        .jx-search-desktop {
          display:   none;   /* mobile-first: hidden */
          flex:      1;
          max-width: 340px;
          position:  relative;
        }
        .jx-search-icon {
          position:      absolute;
          left:          var(--space-3);
          top:           50%;
          transform:     translateY(-50%);
          color:         var(--color-text-muted);
          pointer-events:none;
          display:       flex;
          align-items:   center;
        }
        .jx-search-input {
          /* Inherits globals.css base input styles */
          padding-left:  2.25rem !important;
          padding-right: var(--space-3) !important;
          background:    rgba(255, 255, 255, 0.07) !important;
          border:        1.5px solid rgba(255, 255, 255, 0.10) !important;
          color:         var(--color-white) !important;
          min-height:    2.5rem;
          font-size:     var(--text-sm) !important;
          border-radius: var(--radius-md) !important;
          transition:
            border-color var(--transition-fast),
            background   var(--transition-fast),
            box-shadow   var(--transition-fast) !important;
        }
        .jx-search-input::placeholder { color: rgba(255, 255, 255, 0.30) !important; }
        .jx-search-input:focus {
          border-color: rgba(232, 160, 32, 0.50) !important;
          background:   rgba(255, 255, 255, 0.10) !important;
          box-shadow:   0 0 0 3px rgba(232, 160, 32, 0.12) !important;
          outline:      none !important;
        }
        /* Cancel button browser default */
        .jx-search-input::-webkit-search-cancel-button { display: none; }

        /* ── DESKTOP NAV (hidden mobile, shown ≥768px) ─────────────── */
        .jx-nav-desktop { display: none; } /* mobile-first */
        .jx-nav-list {
          display:    flex;
          align-items:center;
          /* Fluid gap: tighter on tablet, wider on desktop */
          gap:        clamp(var(--space-2), 1.5vw, var(--space-5));
          list-style: none;
          margin:     0;
          padding:    0;
        }

        /* ── DESKTOP NAV LINKS ─────────────────────────────────────────
           Uses globals.css tokens: --text-sm, --tracking-wider,
           --color-amber, --transition-fast, --radius-sm
        ── */
        .jx-nav-link {
          position:       relative;
          display:        inline-flex;
          flex-direction: column;
          align-items:    center;
          gap:            3px;
          color:          rgba(255, 255, 255, 0.55);
          font-size:      var(--text-sm);
          font-weight:    600;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          text-decoration:none;
          /* 44px tap area via padding */
          padding:        calc((44px - 1lh) / 2) 0;
          white-space:    nowrap;
          transition:     color var(--transition-fast);
        }
        .jx-nav-link:hover { color: var(--color-white); }
        .jx-nav-link--active { color: var(--color-amber); }
        .jx-nav-link--active:hover { color: var(--color-amber-light); }
        .jx-nav-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }
        /* Animated underline pip */
        .jx-nav-link__pip {
          display:         block;
          width:           100%;
          height:          2px;
          background:      var(--color-amber);
          border-radius:   var(--radius-full);
          transform-origin:center;
          animation:       pipIn 0.25s var(--transition-spring) both;
        }
        @keyframes pipIn {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* ── MOBILE CONTROLS ─────────────────────────────────────────── */
        .jx-mobile-controls {
          display:    flex;
          align-items:center;
          gap:        var(--space-1);
          flex-shrink:0;
        }

        /* ── ICON BUTTON (search + close) ──────────────────────────────
           44×44 touch target per WCAG 2.5.5
        ── */
        .jx-icon-btn {
          background:      none;
          border:          none;
          cursor:          pointer;
          min-width:       44px;
          min-height:      44px;
          display:         flex;
          align-items:     center;
          justify-content: center;
          color:           rgba(255, 255, 255, 0.45);
          border-radius:   var(--radius-md);
          transition:
            color       var(--transition-fast),
            background  var(--transition-fast);
        }
        .jx-icon-btn:hover    { color: var(--color-white); background: rgba(255, 255, 255, 0.07); }
        .jx-icon-btn--active  { color: var(--color-amber); background: var(--color-amber-muted); }
        .jx-icon-btn--active:hover { color: var(--color-amber-light); }
        .jx-icon-btn:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }

        /* ── HAMBURGER BUTTON ──────────────────────────────────────────
           3 animated bars; transforms to X when open.
        ── */
        .jx-hamburger {
          background:      transparent;
          border:          none;
          cursor:          pointer;
          padding:         0;
          display:         flex;
          flex-direction:  column;
          justify-content: center;
          align-items:     center;
          gap:             5px;
          min-width:       44px;
          min-height:      44px;
          border-radius:   var(--radius-md);
          transition:      background var(--transition-fast);
        }
        .jx-hamburger:hover    { background: rgba(255, 255, 255, 0.06); }
        .jx-hamburger:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }
        .jx-hamburger__bar {
          display:         block;
          height:          2px;
          background:      var(--color-white);
          border-radius:   var(--radius-full);
          transform-origin:center;
          transition:
            transform var(--transition-base),
            opacity   var(--transition-base),
            width     var(--transition-base);
        }
        .jx-hamburger__bar--top    { width: 22px; }
        .jx-hamburger__bar--mid    { width: 22px; }
        .jx-hamburger__bar--bottom { width: 22px; }
        /* Open state → X */
        .jx-hamburger--open .jx-hamburger__bar--top    { transform: translateY(7px) rotate(45deg); }
        .jx-hamburger--open .jx-hamburger__bar--mid    { opacity: 0; width: 0; }
        .jx-hamburger--open .jx-hamburger__bar--bottom { transform: translateY(-7px) rotate(-45deg); }

        /* ── MOBILE SEARCH PANEL ───────────────────────────────────────
           Collapses to 0 height when closed; uses visibility for a11y.
           Token: --transition-base, --color-border-dark
        ── */
        .jx-search-mobile {
          overflow:   hidden;
          max-height: 0;
          visibility: hidden;
          opacity:    0;
          transition:
            max-height var(--transition-base),
            visibility var(--transition-base),
            opacity    var(--transition-base);
          border-top: 0px solid rgba(232, 160, 32, 0.12);
          background: rgba(10, 10, 10, 0.98);
        }
        .jx-search-mobile--open {
          max-height: 88px;
          visibility: visible;
          opacity:    1;
          border-top-width: 1px;
        }
        .jx-search-mobile__inner {
          padding: var(--space-3) var(--page-padding-x);
        }
        .jx-search-mobile__field {
          position: relative;
          display:  flex;
          align-items: center;
        }
        .jx-search-mobile__field .jx-search-icon {
          left: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }
        .jx-search-input--mobile {
          font-size: var(--text-base) !important;
        }
        .jx-search-clear {
          position:        absolute;
          right:           var(--space-3);
          top:             50%;
          transform:       translateY(-50%);
          background:      none;
          border:          none;
          cursor:          pointer;
          color:           rgba(255, 255, 255, 0.40);
          min-width:       28px;
          min-height:      28px;
          display:         flex;
          align-items:     center;
          justify-content: center;
          border-radius:   var(--radius-sm);
          transition:      color var(--transition-fast);
        }
        .jx-search-clear:hover { color: var(--color-white); }

        /* ── MOBILE DRAWER ─────────────────────────────────────────────
           Full-screen slide-in from right.
           Tokens: --z-overlay, --transition-slow, --color-border-dark
        ── */
        .jx-drawer {
          position:             fixed;
          inset:                var(--nav-height-mobile) 0 0 0;
          z-index:              var(--z-overlay);
          background:           rgba(10, 10, 10, 0.98);
          backdrop-filter:      blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display:              flex;
          flex-direction:       column;
          overflow-y:           auto;
          overscroll-behavior:  contain;
          transform:            translateX(100%);
          transition:           transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
          border-top:           1px solid rgba(232, 160, 32, 0.15);
          pointer-events:       none;
          /* smooth scroll within drawer */
          -webkit-overflow-scrolling: touch;
        }
        .jx-drawer--open {
          transform:     translateX(0);
          pointer-events:auto;
        }
        .jx-drawer__glow {
          position:      absolute;
          top:           0;
          right:         0;
          width:         min(40vw, 280px);
          height:        min(40vw, 280px);
          background:    radial-gradient(circle, rgba(232, 160, 32, 0.07) 0%, transparent 70%);
          pointer-events:none;
          z-index:       0;
        }

        /* Drawer nav */
        .jx-drawer__nav {
          position:       relative;
          z-index:        1;
          flex:           1;
          padding:        clamp(var(--space-6), 6vw, var(--space-10)) var(--page-padding-x);
          display:        flex;
          flex-direction: column;
          gap:            var(--space-2);
        }
        .jx-drawer__eyebrow {
          /* .eyebrow-light from globals.css */
          margin-bottom: var(--space-4);
          opacity:       0.65;
        }
        .jx-drawer__list {
          list-style: none;
          margin:     0;
          padding:    0;
        }

        /* Drawer link items */
        .jx-drawer__item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        /* Stagger animation — applied when drawer opens */
        .jx-drawer__item--animate {
          animation: drawerItemIn 0.4s ease both;
        }
        @keyframes drawerItemIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .jx-drawer__link {
          display:        flex;
          align-items:    center;
          justify-content:space-between;
          padding:        var(--space-4) 0;
          font-family:    var(--font-display);
          font-weight:    600;
          /* Fluid: 1.1rem mobile → 1.35rem tablet */
          font-size:      clamp(1.1rem, 4vw, 1.35rem);
          letter-spacing: var(--tracking-normal);
          /* Sentence case — too large for uppercase */
          text-transform: none;
          color:          rgba(255, 255, 255, 0.80);
          text-decoration:none;
          min-height:     3rem;  /* generous touch target */
          transition:
            color       var(--transition-fast),
            padding-left var(--transition-fast);
        }
        .jx-drawer__link:hover {
          color:        var(--color-amber-light);
          padding-left: var(--space-2);
        }
        .jx-drawer__link--active {
          color:       var(--color-amber);
          font-weight: 800;
        }
        .jx-drawer__link--active .jx-drawer__link-arrow {
          color: var(--color-amber);
        }
        .jx-drawer__link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }
        .jx-drawer__link-text { flex: 1; }
        .jx-drawer__link-arrow {
          color:      rgba(255, 255, 255, 0.18);
          flex-shrink:0;
          display:    flex;
          align-items:center;
          transition:
            transform var(--transition-fast),
            color     var(--transition-fast);
        }
        .jx-drawer__link:hover .jx-drawer__link-arrow {
          transform: translateX(4px);
          color:     rgba(232, 160, 32, 0.6);
        }

        /* Drawer CTA card — .surface-dark + amber-muted from globals.css */
        .jx-drawer__cta {
          margin-top:    var(--space-8);
          padding:       var(--space-6);
          background:    var(--color-amber-muted);
          border:        1px solid rgba(232, 160, 32, 0.22);
          border-radius: var(--radius-lg);
          /* animate-fade-up from globals.css pattern */
          animation:     fade-up 0.5s ease 0.35s both;
        }
        .jx-drawer__cta-eyebrow { margin-bottom: var(--space-2); }
        .jx-drawer__cta-body {
          font-size:    var(--text-base);
          color:        rgba(255, 255, 255, 0.60);
          margin-bottom:var(--space-4);
          line-height:  var(--leading-relaxed);
          max-width:    none;
        }
        .jx-drawer__cta-btn {
          width:           100%;
          justify-content: center;
          gap:             var(--space-2);
        }

        /* Drawer footer */
        .jx-drawer__footer {
          position:        relative;
          z-index:         1;
          padding:         var(--space-5) var(--page-padding-x);
          border-top:      1px solid rgba(255, 255, 255, 0.06);
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          gap:             var(--space-4);
          flex-wrap:       wrap;
        }
        .jx-drawer__footer-logo {
          font-family:    var(--font-display);
          font-weight:    900;
          font-size:      var(--text-md);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color:          var(--color-white);
        }
        .jx-drawer__footer-copy {
          font-size: var(--text-sm);
          color:     var(--color-text-muted);
        }

        /* ── BACKDROP ──────────────────────────────────────────────────
           z-index: overlay - 1 → blocks page, below drawer.
        ── */
        .jx-backdrop {
          position:   fixed;
          inset:      0;
          z-index:    calc(var(--z-overlay) - 1);
          background: rgba(0, 0, 0, 0.55);
          cursor:     pointer;
          /* animate-fade-in from globals.css */
          animation:  fade-in 0.25s ease both;
        }

        /* ══════════════════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS — mobile-first scale-up
        ══════════════════════════════════════════════════════════════ */

        /* ── XS: 320–479px — smallest phones ── */
        @media (max-width: 359px) {
          .jx-logo { font-size: 1rem; }
          /* Tighten inner gap for ultra-narrow */
          .jx-header__inner { gap: var(--space-2); }
        }

        /* ── SM: 480–767px — larger phones ── */
        @media (min-width: 480px) {
          .jx-drawer__link {
            font-size: clamp(1.15rem, 3.5vw, 1.4rem);
          }
        }

        /* ── MD: 768px — tablets, iPad portrait ── */
        @media (min-width: 768px) {
          /* Show desktop nav; hide mobile controls */
          .jx-nav-desktop      { display: flex !important; }
          .jx-mobile-controls  { display: none  !important; }
          /* Drawer and mobile search are unreachable — hide from DOM flow */
          .jx-drawer           { display: none  !important; }
          .jx-search-mobile    { display: none  !important; }
          /* Full nav height */
          .jx-header           { height: var(--nav-height); }  /* 4.25rem */
        }

        /* ── LG: 1024px — laptops, iPad landscape ── */
        @media (min-width: 1024px) {
          /* Reveal inline search bar */
          .jx-search-desktop { display: flex !important; }
          /* Slightly larger logo */
          .jx-logo { font-size: clamp(1.15rem, 2vw, 1.35rem); }
        }

        /* ── XL: 1280px — large desktops ── */
        @media (min-width: 1280px) {
          .jx-nav-list {
            gap: var(--space-6);
          }
          .jx-search-desktop {
            max-width: 400px;
          }
        }

        /* ── 2XL: 1536px — wide monitors ── */
        @media (min-width: 1536px) {
          .jx-search-desktop { max-width: 480px; }
        }

        /* ── Touch device adjustments ─────────────────────────────────
           Override hover transforms on coarse-pointer devices.
           Mirrors globals.css @media (hover: none) and (pointer: coarse)
        ── */
        @media (hover: none) and (pointer: coarse) {
          .jx-nav-link:hover  { color: rgba(255, 255, 255, 0.55); }
          .jx-icon-btn:hover  { background: none; }
          .jx-hamburger:hover { background: transparent; }
          /* Active states instead */
          .jx-icon-btn:active { background: rgba(255, 255, 255, 0.10); }
          .jx-hamburger:active { background: rgba(255, 255, 255, 0.08); }
          /* Drawer links: ensure generous tap area */
          .jx-drawer__link   { min-height: 3.25rem; }
          /* Disable slide-left on hover for drawer links */
          .jx-drawer__link:hover { padding-left: 0; }
        }

        /* ── Reduced motion ────────────────────────────────────────────
           Mirrors globals.css @media (prefers-reduced-motion: reduce)
        ── */
        @media (prefers-reduced-motion: reduce) {
          .jx-drawer  { transition: none; }
          .jx-header  { transition: none; }
          .jx-drawer__item--animate,
          .jx-drawer__cta,
          .jx-nav-link__pip,
          .jx-backdrop { animation: none !important; }
          .jx-search-mobile { transition: none; }
        }

        /* ── Forced colors (Windows High Contrast) ─────────────────────
           Mirrors globals.css @media (forced-colors: active)
        ── */
        @media (forced-colors: active) {
          .jx-header          { border-bottom: 1px solid ButtonText; }
          .jx-nav-link--active { color: Highlight; border-bottom-color: Highlight; }
          .jx-icon-btn,
          .jx-hamburger       { border: 1px solid ButtonText; }
          .jx-drawer          { border: 1px solid ButtonText; }
          .jx-backdrop        { background: rgba(0,0,0,0.7); forced-color-adjust: none; }
        }

        /* ── Print ─────────────────────────────────────────────────────
           Mirrors globals.css @media print — hide nav entirely
        ── */
        @media print {
          .jx-header,
          .jx-drawer,
          .jx-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}