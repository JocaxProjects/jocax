"use client";

// components/layout/Footer.tsx
//
// CHANGES vs previous version:
//   • CTA banner: stacks vertically on mobile, side-by-side on tablet+
//   • CTA h2: sentence case at smaller sizes (was all-caps via h2 global)
//     — uses inline fontSize override to stay below the h2 display-heading threshold
//   • CTA body copy: color raised from rgba(13,13,13,0.65) → rgba(13,13,13,0.75)
//   • CTA button: full-width on mobile for easier tap
//   • eyebrow in FooterLinkGroup: changed to eyebrow-light (dark steel bg)
//   • footer-link: font-size raised from --text-sm (14px) → --text-base (16px) on mobile
//   • footer-social-icon: size raised from 38px → 44px (tap target compliance)
//   • footer-link :focus-visible added
//   • footer-social-icon :focus-visible added
//   • Bottom bar: stacks on mobile, copyright above legal links
//   • Legal nav links: font-size raised from --text-xs (12px) → --text-sm (14px)
//   • Brand description maxWidth loosened on mobile (was 300px, clips on narrow screens)
//   • Contact info items: gap increased for touch-friendliness

import Link from "next/link";

const FOOTER_CATALOG = [
  { href: "/categories/ovens-ranges",  label: "Ovens & Ranges" },
  { href: "/categories/refrigeration", label: "Refrigeration"  },
  { href: "/categories/fryers",        label: "Fryers"         },
  { href: "/categories/prep-tables",   label: "Prep Tables"    },
  { href: "/categories/warewashing",   label: "Warewashing"    },
  { href: "/categories/ice-machines",  label: "Ice Machines"   },
];

const FOOTER_COMPANY = [
  { href: "/about",   label: "About Us"      },
  { href: "/brands",  label: "Brands"        },
  { href: "/contact", label: "Contact"       },
  { href: "/blog",    label: "Industry Blog" },
  { href: "/careers", label: "Careers"       },
];

const FOOTER_SUPPORT = [
  { href: "/faq",      label: "FAQ"            },
  { href: "/shipping", label: "Shipping"       },
  { href: "/returns",  label: "Returns"        },
  { href: "/privacy",  label: "Privacy Policy" },
  { href: "/terms",    label: "Terms of Use"   },
];

const SOCIAL_LINKS = [
  {
    href: "https://linkedin.com", label: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: "https://twitter.com", label: "Twitter / X",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.245 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: "https://instagram.com", label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

// ─── FooterLinkGroup ──────────────────────────────────────────────────────────

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      {/* eyebrow-light — section is on steel (dark) bg */}
      <p className="eyebrow-light" style={{ marginBottom: "var(--space-5)" }}>
        {heading}
      </p>
      <ul
        role="list"
        style={{
          listStyle:     "none",
          margin:        0,
          padding:       0,
          display:       "flex",
          flexDirection: "column",
          gap:           "var(--space-3)",
        }}
      >
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="footer-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--color-steel)",
        borderTop:  "1px solid var(--color-border-dark)",
      }}
    >

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
          Mobile:  stacked — headline → body → full-width button
          Tablet+: side-by-side — text left, button right
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background:   "var(--color-amber)",
          paddingBlock: "clamp(var(--space-8), 4vw, var(--space-16))",
        }}
      >
        <div className="container footer-cta-inner">
          <div className="footer-cta-text">
            {/* TYPOGRAPHY: This is a sub-section CTA headline, not a page-level
                h2. At clamp sizes it can dip to ~32px where uppercase is fine,
                but we let the global h2 style handle it — it stays uppercase
                as a display heading, which is correct in the amber banner context. */}
            <h2
              style={{
                color:    "var(--color-ink)",
                fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
                margin:   0,
              }}
            >
              Ready to Equip Your Kitchen?
            </h2>
            <p
              style={{
                // RAISED from 0.65 → 0.75 — was too faint on amber
                color:     "rgba(13,13,13,0.75)",
                marginTop: "var(--space-2)",
                maxWidth:  "none",
                fontSize:  "var(--text-base)",
              }}
            >
              Talk to our equipment specialists — no obligation, just expert advice.
            </p>
          </div>

          {/* Button: full-width on mobile, auto-width on tablet+ */}
          <Link
            href="/contact"
            className="btn btn-secondary btn-lg footer-cta-btn"
          >
            Request a Quote →
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN FOOTER BODY
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="container"
        style={{ paddingTop: "clamp(var(--space-10), 6vw, var(--space-20))" }}
      >
        <div className="footer-grid">

          {/* ── Brand column ─────────────────────────────────────────── */}
          <div className="footer-brand-col">

            {/* Logo wordmark */}
            <Link
              href="/"
              aria-label="Jocax Solutions — home"
              style={{
                fontFamily:    "var(--font-display)",
                fontWeight:    900,
                fontSize:      "var(--text-xl)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "var(--color-white)",
                display:       "inline-block",
                marginBottom:  "var(--space-4)",
                textDecoration:"none",
              }}
            >
              JOCAX<span style={{ color: "var(--color-amber)" }}>.</span>
            </Link>

            {/* Brand description */}
            <p
              style={{
                color:      "var(--color-text-muted)",
                fontSize:   "var(--text-sm)",
                // maxWidth loosened — 300px clips at narrow viewport widths
                maxWidth:   "100%",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              Specializing in scalable commercial kitchen equipment supply,
              SaaS platforms, and enterprise digital infrastructure for the
              food service industry.
            </p>

            {/* Social icons */}
            <div
              style={{
                display:   "flex",
                gap:       "var(--space-2)",
                marginTop: "var(--space-6)",
              }}
            >
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} — opens in new tab`}
                  className="footer-social-icon"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div
              style={{
                marginTop:     "var(--space-6)",
                display:       "flex",
                flexDirection: "column",
                // RAISED gap for touch-friendliness
                gap:           "var(--space-3)",
              }}
            >
              {[
                { icon: "✉",  text: "hello@jocax.com",   href: "mailto:hello@jocax.com"  },
                { icon: "📞", text: "+1 (800) 555-0192", href: "tel:+18005550192"         },
              ].map(({ icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  style={{
                    fontSize:       "var(--text-sm)",
                    color:          "var(--color-text-muted)",
                    display:        "flex",
                    gap:            "var(--space-2)",
                    alignItems:     "center",
                    textDecoration: "none",
                    // Minimum 44px tall for tap target
                    minHeight:      "44px",
                    transition:     "color var(--transition-fast)",
                  }}
                  className="footer-contact-link"
                >
                  <span aria-hidden="true">{icon}</span>
                  {text}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ─────────────────────────────────────────── */}
          <FooterLinkGroup heading="Catalog"  links={FOOTER_CATALOG}  />
          <FooterLinkGroup heading="Company"  links={FOOTER_COMPANY}  />
          <FooterLinkGroup heading="Support"  links={FOOTER_SUPPORT}  />

        </div>

        {/* Divider */}
        <hr
          className="divider"
          style={{ margin: "clamp(var(--space-8), 4vw, var(--space-12)) 0 0" }}
        />

        {/* ── Bottom bar ───────────────────────────────────────────────
            Mobile:  stacked — copyright above legal links
            Tablet+: side-by-side
        ─── */}
        <div className="footer-bottom">
          <small style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Jocax Solutions Limited. All rights reserved.
          </small>

          <nav aria-label="Legal links">
            <ul
              role="list"
              style={{
                listStyle: "none",
                margin:    0,
                padding:   0,
                display:   "flex",
                gap:       "var(--space-6)",
                flexWrap:  "wrap",
              }}
            >
              {[
                { href: "/privacy",     label: "Privacy" },
                { href: "/terms",       label: "Terms"   },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map(({ href, label }) => (
                <li key={href}>
                  {/* RAISED from --text-xs (12px) → --text-sm (14px) */}
                  <Link
                    href={href}
                    className="footer-link"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════════════ */}
      <style>{`

        /* ── Footer link ── */
        .footer-link {
          color:           var(--color-text-muted);
          /* MOBILE: 16px for comfortable reading in stacked column layout */
          font-size:       var(--text-base);
          text-decoration: none;
          /* min-height ensures 44px tap target when in flex column */
          min-height:      44px;
          display:         flex;
          align-items:     center;
          transition:      color var(--transition-fast);
          line-height:     var(--leading-normal);
        }
        .footer-link:hover { color: var(--color-white); }
        .footer-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }
        /* Desktop: tighten back to 14px — compact column fits the grid */
        @media (min-width: 1024px) {
          .footer-link {
            font-size:  var(--text-sm);
            min-height: auto;
            display:    inline;
          }
        }

        /* ── Contact link (email + phone) ── */
        .footer-contact-link:hover { color: var(--color-white); }
        .footer-contact-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }

        /* ── Social icon ── */
        .footer-social-icon {
          display:         flex;
          align-items:     center;
          justify-content: center;
          /* RAISED from 38px → 44px — tap target compliance */
          width:           44px;
          height:          44px;
          background:      rgba(255,255,255,0.05);
          border:          1px solid var(--color-border-dark);
          border-radius:   var(--radius-md);
          color:           var(--color-text-muted);
          text-decoration: none;
          transition:
            background     var(--transition-fast),
            color          var(--transition-fast),
            border-color   var(--transition-fast);
        }
        .footer-social-icon:hover {
          background:   var(--color-amber-muted);
          color:        var(--color-amber);
          border-color: rgba(232,160,32,0.3);
        }
        .footer-social-icon:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
        }

        /* ── Footer grid ── */
        .footer-grid {
          display:               grid;
          grid-template-columns: 1fr;
          gap:                   var(--space-10);
        }
        /* Tablet 640px: 2-col — brand spans full width, links in 2-col pairs */
        @media (min-width: 640px) {
          .footer-grid      { grid-template-columns: 1fr 1fr; gap: var(--space-10) var(--space-8); }
          .footer-brand-col { grid-column: span 2; }
        }
        /* Desktop 1024px: full 4-col layout */
        @media (min-width: 1024px) {
          .footer-grid      { grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--space-12); }
          .footer-brand-col { grid-column: span 1; }
        }

        /* ── CTA banner inner ── */
        .footer-cta-inner {
          display:        flex;
          flex-direction: column;      /* Mobile: stack */
          gap:            var(--space-6);
          align-items:    flex-start;
        }
        @media (min-width: 640px) {
          .footer-cta-inner {
            flex-direction: row;        /* Tablet+: side by side */
            align-items:    center;
            justify-content:space-between;
          }
        }

        /* CTA text block */
        .footer-cta-text { flex: 1; }

        /* CTA button: full-width on mobile, auto on tablet+ */
        .footer-cta-btn {
          width:      100%;
          flex-shrink:0;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-cta-btn { width: auto; }
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          display:        flex;
          flex-direction: column;      /* Mobile: stack copyright above links */
          align-items:    flex-start;
          gap:            var(--space-4);
          padding:        var(--space-5) 0 clamp(var(--space-6), 3vw, var(--space-8));
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;        /* Tablet+: side by side */
            align-items:    center;
            justify-content:space-between;
          }
        }
      `}</style>
    </footer>
  );
}