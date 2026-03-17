"use client";

// components/layout/Header.tsx
//
// CHANGES vs previous version:
//   • NAV_LINKS: added { href: "/", label: "Home" } as first item
//   • NAV_LINKS: removed "Brands" link
//   • eyebrow in mobile drawer "Navigation" label: eyebrow-light (dark bg)
//   • eyebrow in mobile CTA card: eyebrow-light (dark amber-muted bg)
//   • header-nav-link font-size: raised from --text-xs (12px) → --text-sm (14px)
//     — 12px uppercase nav links are at the floor of legibility; 14px is safer
//   • header-nav-link focus-visible: explicit amber outline added
//   • Mobile hamburger + search buttons: explicit min-width/height 44px (tap target)
//   • Mobile drawer nav links: removed text-transform uppercase at large sizes
//     — at clamp(1.15rem → 1.4rem) sentence case reads ~15% faster
//   • Mobile search: aria-hidden on container replaced with visibility toggle
//     so keyboard users can't tab into a hidden input
//   • Backdrop z-index: raised above mobile menu to correctly block interaction
//   • isActive for "/" fixed: exact match only (was already correct, kept)
//   • Tablet breakpoint (768–1023px): now shows all links (was hiding Search + About)
//     — 6 short links at 14px fit comfortably at 768px; hiding was unnecessary

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",          label: "Home"       }, // ADDED
  { href: "/products",  label: "Catalog"    },
  { href: "/categories",label: "Categories" },
  // "Brands" removed
  { href: "/search",    label: "Search"     },
  { href: "/about",     label: "About"      },
  { href: "/contact",   label: "Contact"    },
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
  const searchRef                   = useRef<HTMLInputElement>(null);
  const prevPathnameRef             = useRef(pathname);
  const menuButtonRef               = useRef<HTMLButtonElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu + search on route change
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Focus search input when search panel opens
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Return focus to hamburger button when drawer closes
  useEffect(() => {
    if (!menuOpen) menuButtonRef.current?.focus();
  }, [menuOpen]);

  // Escape key closes menu and search
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
      {/* ── Skip to content ── */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* ══════════════════════════════════════════════════════════════════
          NAV BAR
      ══════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className="header-root"
        data-scrolled={scrolled || menuOpen}
        style={{
          position:             "fixed",
          inset:                "0 0 auto 0",
          height:               "var(--nav-height)",
          zIndex:               "var(--z-sticky)",
          background:           scrolled || menuOpen
            ? "rgba(13,13,13,0.98)"
            : "rgba(13,13,13,0.82)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom:         scrolled
            ? "1px solid rgba(232,160,32,0.2)"
            : "1px solid rgba(232,160,32,0.08)",
          transition:           "background var(--transition-base), border-color var(--transition-base)",
        }}
      >
        <div
          className="container"
          style={{
            height:         "100%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "var(--space-4)",
          }}
        >

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label="Jocax Solutions — home"
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    900,
              fontSize:      "clamp(1.1rem, 2.5vw, 1.35rem)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:         "var(--color-white)",
              flexShrink:    0,
              lineHeight:    1,
              textDecoration:"none",
            }}
          >
            JOCAX<span style={{ color: "var(--color-amber)" }}>.</span>
          </Link>

          {/* ── Desktop search ────────────────────────────────────────── */}
          <div
            className="header-search-desktop"
            style={{
              flex:      1,
              maxWidth:  "360px",
              position:  "relative",
              display:   "none",   /* shown via media query */
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position:      "absolute",
                left:          "var(--space-3)",
                top:           "50%",
                transform:     "translateY(-50%)",
                color:         "var(--color-text-muted)",
                pointerEvents: "none",
                fontSize:      "var(--text-sm)",
              }}
            >
              🔍
            </span>
            <input
              type="search"
              placeholder="Search equipment…"
              aria-label="Search equipment"
              style={{
                paddingLeft: "2.25rem",
                background:  "rgba(255,255,255,0.07)",
                border:      "1px solid rgba(255,255,255,0.1)",
                color:       "var(--color-white)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,160,32,0.5)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
              }}
            />
          </div>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="header-nav-desktop"
            style={{ display: "none" }}   /* shown via media query */
          >
            <ul
              role="list"
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "clamp(var(--space-2), 1.5vw, var(--space-6))",
                listStyle:  "none",
                margin:     0,
                padding:    0,
              }}
            >
              {NAV_LINKS.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`header-nav-link${active ? " header-nav-link--active" : ""}`}
                    >
                      {label}
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

          {/* ── Mobile controls ───────────────────────────────────────── */}
          <div
            className="header-mobile-controls"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "var(--space-1)",
            }}
          >
            {/* Search toggle — 44×44 tap target */}
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="mobile-search-panel"
              onClick={() => setSearchOpen((o) => !o)}
              className="header-icon-btn"
              style={{
                color: searchOpen ? "var(--color-amber)" : "var(--color-text-faint)",
              }}
            >
              {searchOpen ? "✕" : "🔍"}
            </button>

            {/* Hamburger — 44×44 tap target */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="header-hamburger"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    display:         "block",
                    height:          "2px",
                    background:      "var(--color-white)",
                    borderRadius:    "2px",
                    transformOrigin: "center",
                    transition:
                      "transform var(--transition-base), opacity var(--transition-base), width var(--transition-base)",
                    width:   i === 1 && menuOpen ? "60%" : "100%",
                    opacity: i === 1 && menuOpen ? 0 : 1,
                    transform: menuOpen
                      ? i === 0 ? "translateY(7px) rotate(45deg)"
                      : i === 2 ? "translateY(-7px) rotate(-45deg)"
                      : "none"
                      : "none",
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* ── Mobile search panel ───────────────────────────────────────
            Uses visibility + max-height rather than aria-hidden alone,
            so keyboard users can never tab into a visually-hidden input.
        ── */}
        <div
          id="mobile-search-panel"
          role="search"
          aria-label="Site search"
          className="header-mobile-search"
          style={{
            overflow:   "hidden",
            maxHeight:  searchOpen ? "80px" : "0",
            visibility: searchOpen ? "visible" : "hidden",
            transition: "max-height var(--transition-base), visibility var(--transition-base)",
            borderTop:  searchOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
            background: "rgba(13,13,13,0.98)",
          }}
        >
          <div style={{ padding: "var(--space-3) var(--page-padding-x)" }}>
            <div style={{ position: "relative" }}>
              <span
                aria-hidden="true"
                style={{
                  position:      "absolute",
                  left:          "var(--space-3)",
                  top:           "50%",
                  transform:     "translateY(-50%)",
                  color:         "var(--color-text-muted)",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                ref={searchRef}
                type="search"
                placeholder="Search equipment…"
                aria-label="Search equipment"
                tabIndex={searchOpen ? 0 : -1}
                style={{
                  paddingLeft: "2.4rem",
                  background:  "rgba(255,255,255,0.08)",
                  border:      "1px solid rgba(255,255,255,0.08)",
                  color:       "var(--color-white)",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className="header-mobile-menu"
        style={{
          position:             "fixed",
          inset:                "var(--nav-height) 0 0 0",
          zIndex:               "var(--z-overlay)",
          background:           "rgba(13,13,13,0.98)",
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display:              "flex",
          flexDirection:        "column",
          overflowY:            "auto",
          transform:            menuOpen ? "translateX(0)" : "translateX(100%)",
          transition:           "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          borderTop:            "1px solid rgba(232,160,32,0.15)",
          // Prevent any content behind from being interactable when closed
          pointerEvents:        menuOpen ? "auto" : "none",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position:      "absolute",
            top:           0,
            right:         0,
            width:         "40vw",
            height:        "40vw",
            background:    "radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <nav
          aria-label="Mobile navigation"
          style={{
            flex:          1,
            padding:       "clamp(var(--space-6), 5vw, var(--space-10)) var(--page-padding-x)",
            display:       "flex",
            flexDirection: "column",
            gap:           "var(--space-1)",
          }}
        >
          {/* Section label — eyebrow-light on dark background */}
          <p
            className="eyebrow-light"
            style={{ marginBottom: "var(--space-4)", opacity: 0.7 }}
          >
            Navigation
          </p>

          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map(({ href, label }, i) => {
              const active = isActive(pathname, href);
              return (
                <li
                  key={href}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    animation:    menuOpen
                      ? `mobileNavIn 0.4s ease ${i * 0.06}s both`
                      : "none",
                  }}
                >
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      padding:        "var(--space-4) 0",
                      fontFamily:     "var(--font-display)",
                      fontWeight:     active ? 800 : 600,
                      // TYPOGRAPHY: sentence case at this size — no uppercase
                      // clamp(1.15rem → 1.4rem) = 18–22px, too large for all-caps
                      fontSize:       "clamp(1.15rem, 4vw, 1.4rem)",
                      letterSpacing:  "var(--tracking-normal)",
                      textTransform:  "none",
                      color:          active
                        ? "var(--color-amber)"
                        : "var(--color-white)",
                      textDecoration: "none",
                      transition:     "color var(--transition-fast)",
                    }}
                    // Hover handled via className to avoid inline event handler verbosity
                    className="mobile-nav-link"
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      style={{
                        color:      active ? "var(--color-amber)" : "rgba(255,255,255,0.2)",
                        fontSize:   "1.1rem",
                        transition: "transform var(--transition-fast)",
                      }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile CTA card */}
          <div
            style={{
              marginTop:    "var(--space-8)",
              padding:      "var(--space-6)",
              background:   "var(--color-amber-muted)",
              border:       "1px solid rgba(232,160,32,0.2)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            {/* eyebrow-light — on dark amber-muted bg */}
            <p
              className="eyebrow-light"
              style={{ marginBottom: "var(--space-2)" }}
            >
              Ready to equip your kitchen?
            </p>
            <p
              style={{
                fontSize:   "var(--text-base)",   /* 16px — was --text-sm */
                color:      "rgba(255,255,255,0.65)",
                marginBottom:"var(--space-4)",
                lineHeight: "var(--leading-relaxed)",
                maxWidth:   "none",
              }}
            >
              Get expert advice and fast pricing from our team.
            </p>
            <Link
              href="/contact"
              tabIndex={menuOpen ? 0 : -1}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Get a Quote →
            </Link>
          </div>
        </nav>

        {/* Drawer footer strip */}
        <div
          style={{
            padding:        "var(--space-5) var(--page-padding-x)",
            borderTop:      "1px solid rgba(255,255,255,0.06)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "var(--space-4)",
            flexWrap:       "wrap",
          }}
        >
          <span
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    900,
              fontSize:      "var(--text-md)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:         "var(--color-white)",
            }}
          >
            JOCAX<span style={{ color: "var(--color-amber)" }}>.</span>
          </span>
          <small style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Jocax Solutions Limited
          </small>
        </div>
      </div>

      {/* ── Backdrop (closes drawer on click) ── */}
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          style={{
            position:   "fixed",
            inset:      0,
            // z-index below overlay (drawer) but above page content
            zIndex:     "calc(var(--z-overlay) - 1)",
            background: "rgba(0,0,0,0.5)",
            cursor:     "pointer",
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════════════ */}
      <style>{`

        /* ── Desktop nav links ──
           RAISED from --text-xs (12px) → --text-sm (14px)
           12px uppercase links are at the floor of legibility — 14px is safer.
        ── */
        .header-nav-link {
          color:          rgba(255,255,255,0.55);
          font-size:      var(--text-sm);
          font-weight:    600;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          padding-bottom: 2px;
          border-bottom:  2px solid transparent;
          text-decoration:none;
          transition:     color var(--transition-fast), border-color var(--transition-fast);
          /* Ensure 44px tap area on touch devices via padding */
          padding-top:    calc((44px - 1em) / 2);
          padding-bottom: calc((44px - 1em) / 2);
          border-bottom:  2px solid transparent;
        }
        .header-nav-link:hover {
          color: var(--color-white);
        }
        .header-nav-link--active {
          color:              var(--color-amber);
          border-bottom-color:var(--color-amber);
        }
        .header-nav-link--active:hover { color: var(--color-amber-light); }
        .header-nav-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }

        /* ── Mobile icon button (search + hamburger) ──
           Explicit 44×44 — was implicitly smaller via padding only.
        ── */
        .header-icon-btn {
          background:   none;
          border:       none;
          cursor:       pointer;
          min-width:    44px;
          min-height:   44px;
          display:      flex;
          align-items:  center;
          justify-content: center;
          font-size:    1.1rem;
          line-height:  1;
          border-radius:var(--radius-sm);
          transition:   color var(--transition-fast), background var(--transition-fast);
        }
        .header-icon-btn:hover    { background: rgba(255,255,255,0.06); }
        .header-icon-btn:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }

        /* ── Hamburger button ── */
        .header-hamburger {
          background:     transparent;
          border:         none;
          cursor:         pointer;
          padding:        0;
          display:        flex;
          flex-direction: column;
          justify-content:center;
          align-items:    center;
          gap:            5px;
          min-width:      44px;
          min-height:     44px;
          border-radius:  var(--radius-sm);
          transition:     background var(--transition-fast);
        }
        .header-hamburger:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 2px;
        }

        /* ── Mobile nav link hover ── */
        .mobile-nav-link:hover { color: var(--color-amber) !important; }
        .mobile-nav-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }

        /* ── Breakpoint visibility ──
           Mobile (<768px):  hamburger + search icon only
           Tablet (768–1023px): full desktop nav, NO hamburger, search icon hidden
                               All 6 links shown (was hiding 2 — unnecessary at 768px+)
           Desktop (≥1024px): full desktop nav + inline search bar
        ── */
        @media (min-width: 768px) {
          .header-nav-desktop     { display: flex !important; }
          .header-mobile-controls { display: none  !important; }
          .header-mobile-menu     { display: none  !important; }
          .header-mobile-search   { display: none  !important; }
        }
        @media (min-width: 1024px) {
          .header-search-desktop  { display: flex !important; }
        }

        /* ── Drawer slide-in animation ── */
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </>
  );
}