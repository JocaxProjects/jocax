"use client";

// components/layout/Header.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ENHANCED: Fully leverages globals.css design tokens for every property.
// MOBILE-FIRST: Base styles target mobile, overrides scale up to tablet/desktop.
// RESPONSIVE: XS(320) → SM(480) → MD(768) → LG(1024) → XL(1280) → 2XL(1536)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
  { href: "/categories", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// ── Contact details (single source of truth) ──────────────────────────────
const CONTACT = {
  phone: "+254 725 002 619",
  phoneTel: "tel:+254725002619",
  email: "sales@jocaxsolutions.co.ke",
  emailHref: "mailto:sales@jocaxsolutions.co.ke",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const prevPathnameRef = useRef(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
      {/* ── Hidden SVG filters ── */}
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="logo-recolor" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.8  0.8  0.8  0  0.18
                      0.7  0.7  0.4  0  0.18
                      0.1  0.1  0.1  0  0.18
                      0    0    0    1  0"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Skip to content ── */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* ════════════════════════════════════════════════════════════════
          NAV BAR  (contact strip lives inside as first child)
      ════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className={`jx-header${scrolled || menuOpen ? " jx-header--scrolled" : ""}`}
      >
        {/* ── Contact strip — desktop only, top of fixed header ── */}
        <div className="jx-contact-strip" aria-label="Contact information">
          <div className="container jx-contact-strip__inner">
            <a href={CONTACT.phoneTel} className="jx-contact-strip__item" aria-label={`Call us: ${CONTACT.phone}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.47 11.47 0 0 0 3.59.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.59a1 1 0 0 1-.25 1.01l-2.2 2.19Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {CONTACT.phone}
            </a>
            <a href={CONTACT.emailHref} className="jx-contact-strip__item" aria-label={`Email us: ${CONTACT.email}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="container jx-header__inner">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link href="/" aria-label="Jocax Solutions — home" className="jx-logo">
            <Image
              src="/logo.png"
              alt="Jocax Solutions"
              width={180}
              height={60}
              className="jx-logo__img"
              priority
              style={{ background: "transparent" }}
            />
          </Link>

          {/* ── Desktop inline search ─────────────────────────────────── */}
          <div className="jx-search-desktop" role="search" aria-label="Site search">
            <span className="jx-search-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor" />
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
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
                  <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor" />
                </svg>
              )}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className={`jx-hamburger${menuOpen ? " jx-hamburger--open" : ""}`}
            >
              <span className="jx-hamburger__bar jx-hamburger__bar--top" aria-hidden="true" />
              <span className="jx-hamburger__bar jx-hamburger__bar--mid" aria-hidden="true" />
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
                  <path d="M6.5 1a5.5 5.5 0 1 0 3.67 9.59l2.62 2.62a.75.75 0 1 0 1.06-1.06l-2.62-2.62A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="currentColor" />
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
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
        <div className="jx-drawer__glow" aria-hidden="true" />

        <nav aria-label="Mobile navigation" className="jx-drawer__nav">
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
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Mobile contact links ────────────────────────────────── */}
          <div className="jx-drawer__contact" aria-label="Contact information">
            <p className="eyebrow-light jx-drawer__contact-eyebrow">Get in touch</p>
            <a
              href={CONTACT.phoneTel}
              tabIndex={menuOpen ? 0 : -1}
              className="jx-drawer__contact-link"
              aria-label={`Call us: ${CONTACT.phone}`}
            >
              <span className="jx-drawer__contact-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.47 11.47 0 0 0 3.59.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.59a1 1 0 0 1-.25 1.01l-2.2 2.19Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.emailHref}
              tabIndex={menuOpen ? 0 : -1}
              className="jx-drawer__contact-link"
              aria-label={`Email us: ${CONTACT.email}`}
            >
              <span className="jx-drawer__contact-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {CONTACT.email}
            </a>
          </div>

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
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Drawer footer */}
        <div className="jx-drawer__footer">
          <span className="jx-drawer__footer-logo">
            <Image
              src="/logo.png"
              alt="Jocax Solutions"
              width={110}
              height={38}
              style={{
                height: "34px",
                width: "auto",
                objectFit: "contain",
                background: "transparent",
                filter: "url(#logo-recolor)",
              }}
            />
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
          STYLES
      ════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── CONTACT STRIP (desktop only, child of fixed header) ── */
        .jx-contact-strip {
          display:       none;
          border-bottom: 1px solid rgba(232, 160, 32, 0.10);
          flex-shrink:   0;
        }
        .jx-contact-strip__inner {
          display:         flex;
          align-items:     center;
          justify-content: flex-end;
          gap:             var(--space-6);
          height:          34px;
        }
        .jx-contact-strip__item {
          display:         inline-flex;
          align-items:     center;
          gap:             6px;
          font-size:       var(--text-xs);
          font-weight:     500;
          color:           rgba(255, 255, 255, 0.45);
          text-decoration: none;
          letter-spacing:  var(--tracking-wide);
          transition:      color var(--transition-fast);
          white-space:     nowrap;
        }
        .jx-contact-strip__item:hover        { color: var(--color-amber); }
        .jx-contact-strip__item:focus-visible {
          outline:        2px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }
        .jx-contact-strip__item svg { flex-shrink: 0; opacity: 0.7; }
        .jx-contact-strip__item:hover svg { opacity: 1; }

        .jx-header {
          position:             fixed;
          inset:                0 0 auto 0;
          z-index:              var(--z-sticky);
          background:           rgba(13, 13, 13, 0.82);
          backdrop-filter:      blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom:        1px solid rgba(232, 160, 32, 0.08);
          display:              flex;
          flex-direction:       column;
          transition:
            background      var(--transition-base),
            border-color    var(--transition-base);
          will-change:          background, border-color;
        }
        .jx-header--scrolled {
          background:    rgba(13, 13, 13, 0.98);
          border-bottom: 1px solid rgba(232, 160, 32, 0.22);
          box-shadow:    var(--shadow-lg);
        }

        .jx-header__inner {
          height:          var(--nav-height-mobile);
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          gap:             var(--space-3);
        }

        /* ── LOGO ── */
        .jx-logo {
          display:         inline-flex;
          align-items:     center;
          flex-shrink:     0;
          text-decoration: none;
          transition:      opacity var(--transition-fast);
          background:      transparent !important;
        }
        .jx-logo:hover { opacity: 0.85; }
        .jx-logo:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }
        .jx-logo__img {
          height:     clamp(38px, 5vw, 56px);
          width:      auto;
          object-fit: contain;
          display:    block;
          background: transparent !important;
          filter: url(#logo-recolor);
        }
        .jx-logo span,
        .jx-logo > span {
          background: transparent !important;
        }

        .jx-search-desktop {
          display:   none;
          flex:      1;
          max-width: 340px;
          position:  relative;
        }
        .jx-search-icon {
          position:       absolute;
          left:           var(--space-3);
          top:            50%;
          transform:      translateY(-50%);
          color:          var(--color-text-muted);
          pointer-events: none;
          display:        flex;
          align-items:    center;
        }
        .jx-search-input {
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
        .jx-search-input::-webkit-search-cancel-button { display: none; }

        .jx-nav-desktop { display: none; }
        .jx-nav-list {
          display:     flex;
          align-items: center;
          gap:         clamp(var(--space-2), 1.5vw, var(--space-5));
          list-style:  none;
          margin:      0;
          padding:     0;
        }

        .jx-nav-link {
          position:        relative;
          display:         inline-flex;
          flex-direction:  column;
          align-items:     center;
          gap:             3px;
          color:           rgba(255, 255, 255, 0.55);
          font-size:       var(--text-sm);
          font-weight:     600;
          letter-spacing:  var(--tracking-wider);
          text-transform:  uppercase;
          text-decoration: none;
          padding:         calc((44px - 1lh) / 2) 0;
          white-space:     nowrap;
          transition:      color var(--transition-fast);
        }
        .jx-nav-link:hover           { color: var(--color-white); }
        .jx-nav-link--active         { color: var(--color-amber); }
        .jx-nav-link--active:hover   { color: var(--color-amber-light); }
        .jx-nav-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }
        .jx-nav-link__pip {
          display:          block;
          width:            100%;
          height:           2px;
          background:       var(--color-amber);
          border-radius:    var(--radius-full);
          transform-origin: center;
          animation:        pipIn 0.25s var(--transition-spring) both;
        }
        @keyframes pipIn {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        .jx-mobile-controls {
          display:     flex;
          align-items: center;
          gap:         var(--space-1);
          flex-shrink: 0;
        }

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
            color      var(--transition-fast),
            background var(--transition-fast);
        }
        .jx-icon-btn:hover         { color: var(--color-white); background: rgba(255, 255, 255, 0.07); }
        .jx-icon-btn--active       { color: var(--color-amber); background: var(--color-amber-muted); }
        .jx-icon-btn--active:hover { color: var(--color-amber-light); }
        .jx-icon-btn:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }

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
        .jx-hamburger:hover { background: rgba(255, 255, 255, 0.06); }
        .jx-hamburger:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }
        .jx-hamburger__bar {
          display:          block;
          height:           2px;
          background:       var(--color-white);
          border-radius:    var(--radius-full);
          transform-origin: center;
          transition:
            transform var(--transition-base),
            opacity   var(--transition-base),
            width     var(--transition-base);
        }
        .jx-hamburger__bar--top    { width: 22px; }
        .jx-hamburger__bar--mid    { width: 22px; }
        .jx-hamburger__bar--bottom { width: 22px; }
        .jx-hamburger--open .jx-hamburger__bar--top    { transform: translateY(7px) rotate(45deg); }
        .jx-hamburger--open .jx-hamburger__bar--mid    { opacity: 0; width: 0; }
        .jx-hamburger--open .jx-hamburger__bar--bottom { transform: translateY(-7px) rotate(-45deg); }

        .jx-search-mobile {
          overflow:    hidden;
          max-height:  0;
          visibility:  hidden;
          opacity:     0;
          transition:
            max-height var(--transition-base),
            visibility var(--transition-base),
            opacity    var(--transition-base);
          border-top:  0px solid rgba(232, 160, 32, 0.12);
          background:  rgba(10, 10, 10, 0.98);
        }
        .jx-search-mobile--open {
          max-height:       88px;
          visibility:       visible;
          opacity:          1;
          border-top-width: 1px;
        }
        .jx-search-mobile__inner { padding: var(--space-3) var(--page-padding-x); }
        .jx-search-mobile__field {
          position:    relative;
          display:     flex;
          align-items: center;
        }
        .jx-search-mobile__field .jx-search-icon {
          left:      var(--space-3);
          top:       50%;
          transform: translateY(-50%);
          z-index:   1;
        }
        .jx-search-input--mobile { font-size: var(--text-base) !important; }
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
          -webkit-overflow-scrolling: touch;
        }
        .jx-drawer--open { transform: translateX(0); pointer-events: auto; }
        .jx-drawer__glow {
          position:       absolute;
          top:            0;
          right:          0;
          width:          min(40vw, 280px);
          height:         min(40vw, 280px);
          background:     radial-gradient(circle, rgba(232, 160, 32, 0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index:        0;
        }

        .jx-drawer__nav {
          position:       relative;
          z-index:        1;
          flex:           1;
          padding:        clamp(var(--space-6), 6vw, var(--space-10)) var(--page-padding-x);
          display:        flex;
          flex-direction: column;
          gap:            var(--space-2);
        }
        .jx-drawer__eyebrow { margin-bottom: var(--space-4); opacity: 0.65; }
        .jx-drawer__list    { list-style: none; margin: 0; padding: 0; }

        .jx-drawer__item { border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
        .jx-drawer__item--animate { animation: drawerItemIn 0.4s ease both; }
        @keyframes drawerItemIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .jx-drawer__link {
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          padding:         var(--space-4) 0;
          font-family:     var(--font-display);
          font-weight:     600;
          font-size:       clamp(1.1rem, 4vw, 1.35rem);
          letter-spacing:  var(--tracking-normal);
          text-transform:  none;
          color:           rgba(255, 255, 255, 0.80);
          text-decoration: none;
          min-height:      3rem;
          transition:
            color        var(--transition-fast),
            padding-left var(--transition-fast);
        }
        .jx-drawer__link:hover          { color: var(--color-amber-light); padding-left: var(--space-2); }
        .jx-drawer__link--active        { color: var(--color-amber); font-weight: 800; }
        .jx-drawer__link--active .jx-drawer__link-arrow { color: var(--color-amber); }
        .jx-drawer__link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }
        .jx-drawer__link-text  { flex: 1; }
        .jx-drawer__link-arrow {
          color:       rgba(255, 255, 255, 0.18);
          flex-shrink: 0;
          display:     flex;
          align-items: center;
          transition:
            transform var(--transition-fast),
            color     var(--transition-fast);
        }
        .jx-drawer__link:hover .jx-drawer__link-arrow {
          transform: translateX(4px);
          color:     rgba(232, 160, 32, 0.6);
        }

        /* ── DRAWER CONTACT ── */
        .jx-drawer__contact {
          margin-top:    var(--space-6);
          padding:       var(--space-4) var(--space-5);
          border:        1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          display:       flex;
          flex-direction:column;
          gap:           var(--space-3);
        }
        .jx-drawer__contact-eyebrow { margin-bottom: var(--space-1); opacity: 0.55; }
        .jx-drawer__contact-link {
          display:         flex;
          align-items:     center;
          gap:             var(--space-3);
          font-size:       var(--text-base);
          font-weight:     500;
          color:           rgba(255, 255, 255, 0.75);
          text-decoration: none;
          min-height:      44px;
          border-radius:   var(--radius-md);
          padding:         0 var(--space-1);
          transition:      color var(--transition-fast), background var(--transition-fast);
        }
        .jx-drawer__contact-link:hover {
          color:      var(--color-amber);
          background: var(--color-amber-muted);
        }
        .jx-drawer__contact-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }
        .jx-drawer__contact-icon {
          display:         flex;
          align-items:     center;
          justify-content: center;
          width:           32px;
          height:          32px;
          border-radius:   var(--radius-md);
          background:      rgba(232, 160, 32, 0.10);
          flex-shrink:     0;
          color:           var(--color-amber);
          transition:      background var(--transition-fast);
        }
        .jx-drawer__contact-link:hover .jx-drawer__contact-icon {
          background: rgba(232, 160, 32, 0.20);
        }

        .jx-drawer__cta {
          margin-top:    var(--space-6);
          padding:       var(--space-6);
          background:    var(--color-amber-muted);
          border:        1px solid rgba(232, 160, 32, 0.22);
          border-radius: var(--radius-lg);
          animation:     fade-up 0.5s ease 0.35s both;
        }
        .jx-drawer__cta-eyebrow { margin-bottom: var(--space-2); }
        .jx-drawer__cta-body {
          font-size:     var(--text-base);
          color:         rgba(255, 255, 255, 0.60);
          margin-bottom: var(--space-4);
          line-height:   var(--leading-relaxed);
          max-width:     none;
        }
        .jx-drawer__cta-btn { width: 100%; justify-content: center; gap: var(--space-2); }

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
          display:    flex;
          align-items:center;
          background: transparent !important;
        }
        .jx-drawer__footer-copy { font-size: var(--text-sm); color: var(--color-text-muted); }

        .jx-backdrop {
          position:   fixed;
          inset:      0;
          z-index:    calc(var(--z-overlay) - 1);
          background: rgba(0, 0, 0, 0.55);
          cursor:     pointer;
          animation:  fade-in 0.25s ease both;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 359px) {
          .jx-logo__img     { height: 34px; }
          .jx-header__inner { gap: var(--space-2); }
        }
        @media (min-width: 480px) {
          .jx-drawer__link { font-size: clamp(1.15rem, 3.5vw, 1.4rem); }
        }
        @media (min-width: 768px) {
          .jx-contact-strip   { display: block !important; }
          .jx-nav-desktop     { display: flex !important; }
          .jx-mobile-controls { display: none  !important; }
          .jx-drawer          { display: none  !important; }
          .jx-search-mobile   { display: none  !important; }
          /* header height = strip (34px) + nav row; let flexbox determine total */
          .jx-header__inner   { height: var(--nav-height); }
        }
        @media (min-width: 1024px) {
          .jx-search-desktop { display: flex !important; }
          .jx-logo__img      { height: 56px; }
        }
        @media (min-width: 1280px) {
          .jx-nav-list       { gap: var(--space-6); }
          .jx-search-desktop { max-width: 400px; }
        }
        @media (min-width: 1536px) {
          .jx-search-desktop { max-width: 480px; }
        }
        @media (hover: none) and (pointer: coarse) {
          .jx-nav-link:hover     { color: rgba(255, 255, 255, 0.55); }
          .jx-icon-btn:hover     { background: none; }
          .jx-hamburger:hover    { background: transparent; }
          .jx-icon-btn:active    { background: rgba(255, 255, 255, 0.10); }
          .jx-hamburger:active   { background: rgba(255, 255, 255, 0.08); }
          .jx-drawer__link       { min-height: 3.25rem; }
          .jx-drawer__link:hover { padding-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jx-drawer, .jx-header, .jx-search-mobile { transition: none; }
          .jx-drawer__item--animate,
          .jx-drawer__cta,
          .jx-nav-link__pip,
          .jx-backdrop { animation: none !important; }
        }
        @media (forced-colors: active) {
          .jx-contact-strip    { border-bottom: 1px solid ButtonText; }
          .jx-header           { border-bottom: 1px solid ButtonText; }
          .jx-nav-link--active { color: Highlight; border-bottom-color: Highlight; }
          .jx-icon-btn,
          .jx-hamburger        { border: 1px solid ButtonText; }
          .jx-drawer           { border: 1px solid ButtonText; }
          .jx-backdrop         { background: rgba(0,0,0,0.7); forced-color-adjust: none; }
        }
        @media print {
          .jx-contact-strip, .jx-header, .jx-drawer, .jx-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}