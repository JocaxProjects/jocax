"use client";

// components/layout/Footer.tsx
// Mobile-first centering strategy:
//   • CTA banner: centered stack on mobile, space-between row at sm+
//   • Brand column: centered on mobile (logo, desc, socials, contact), left at lg+
//   • Link groups: centered on mobile, left at lg+
//   • Bottom bar: centered stack on mobile, space-between row at sm+
//   • All existing responsive breakpoints and a11y improvements preserved

import Link from "next/link";
import Image from "next/image";

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
    <div className="footer-link-group">
      <p className="eyebrow-light footer-link-heading">
        {heading}
      </p>
      <ul
        role="list"
        style={{
          listStyle: "none", margin: 0, padding: 0,
          display: "flex", flexDirection: "column",
          gap: "var(--space-3)",
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

      {/* ── Hidden SVG filter — same recolor as Header ── */}
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="footer-logo-recolor" colorInterpolationFilters="sRGB">
            {/*
              Dark navy/black pixels → white/light-gray.
              Amber/gold pixels (high R+G, low B) → stay warm gold.
            */}
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

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background:   "var(--color-amber)",
        paddingBlock: "clamp(var(--space-8), 4vw, var(--space-16))",
      }}>
        <div className="container footer-cta-inner">
          <div className="footer-cta-text">
            <h2 style={{
              color:    "var(--color-ink)",
              fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
              margin:   0,
            }}>
              Ready to Equip Your Kitchen?
            </h2>
            <p style={{
              color:     "rgba(13,13,13,0.75)",
              marginTop: "var(--space-2)",
              maxWidth:  "none",
              fontSize:  "var(--text-base)",
            }}>
              Talk to our equipment specialists — no obligation, just expert advice.
            </p>
          </div>

          <Link href="/contact" className="btn btn-secondary btn-lg footer-cta-btn">
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

            {/* Logo — real image with SVG recolor filter */}
            <Link
              href="/"
              aria-label="Jocax Solutions — home"
              className="footer-logo-link"
            >
              <Image
                src="/logo.png"
                alt="Jocax Solutions"
                width={180}
                height={60}
                className="footer-logo-img"
                style={{ background: "transparent" }}
              />
            </Link>

            {/* Description */}
            <p style={{
              color: "var(--color-text-muted)", fontSize: "var(--text-sm)",
              maxWidth: "100%", lineHeight: "var(--leading-relaxed)",
            }}>
              Specializing in scalable commercial kitchen equipment supply,
              SaaS platforms, and enterprise digital infrastructure for the
              food service industry.
            </p>

            {/* Social icons */}
            <div style={{
              display: "flex", gap: "var(--space-2)",
              marginTop: "var(--space-6)",
              justifyContent: "center",
            }}>
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
            <div style={{
              marginTop: "var(--space-6)",
              display: "flex", flexDirection: "column",
              gap: "var(--space-3)",
              alignItems: "center",
            }}>
              {[
                { icon: "✉",  text: "hello@jocax.com",   href: "mailto:hello@jocax.com"  },
                { icon: "📞", text: "+1 (800) 555-0192", href: "tel:+18005550192"         },
              ].map(({ icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  style={{
                    fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
                    display: "flex", gap: "var(--space-2)", alignItems: "center",
                    textDecoration: "none", minHeight: "44px",
                    transition: "color var(--transition-fast)",
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
        <hr className="divider"
          style={{ margin: "clamp(var(--space-8), 4vw, var(--space-12)) 0 0" }}/>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <small style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Jocax Solutions Limited. All rights reserved.
          </small>

          <nav aria-label="Legal links">
            <ul role="list" style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "flex", gap: "var(--space-6)", flexWrap: "wrap",
              justifyContent: "center",
            }}>
              {[
                { href: "/privacy",     label: "Privacy" },
                { href: "/terms",       label: "Terms"   },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-link" style={{ fontSize: "var(--text-sm)" }}>
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

        /* ── Footer logo ── */
        .footer-logo-link {
          display:         inline-flex;
          align-items:     center;
          text-decoration: none;
          margin-bottom:   var(--space-5);
          transition:      opacity var(--transition-fast);
          background:      transparent !important;
        }
        .footer-logo-link:hover { opacity: 0.85; }
        .footer-logo-link:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 4px;
          border-radius:  var(--radius-sm);
        }
        .footer-logo-img {
          height:     clamp(40px, 5vw, 52px);
          width:      auto;
          object-fit: contain;
          display:    block;
          background: transparent !important;
          /*
           * Same SVG recolor as header:
           * navy/black → white/gray, amber/gold preserved.
           */
          filter: url(#footer-logo-recolor);
        }
        /* Tiny screens */
        @media (max-width: 359px) {
          .footer-logo-img { height: 34px; }
        }
        /* Desktop */
        @media (min-width: 1024px) {
          .footer-logo-img { height: 52px; }
        }

        /* ── Footer link ── */
        .footer-link {
          color: var(--color-text-muted);
          font-size: var(--text-base);
          text-decoration: none;
          min-height: 44px;
          display: flex; align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
          line-height: var(--leading-normal);
        }
        .footer-link:hover { color: var(--color-white); }
        .footer-link:focus-visible {
          outline: 3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius: var(--radius-sm);
        }
        @media (min-width: 1024px) {
          .footer-link {
            font-size: var(--text-sm);
            min-height: auto;
            display: inline;
            justify-content: flex-start;
          }
        }

        /* ── Link group — centered on mobile, left at lg+ ── */
        .footer-link-group {
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .footer-link-heading { margin-bottom: var(--space-5); }
        @media (min-width: 1024px) {
          .footer-link-group { text-align: left; align-items: flex-start; }
        }

        /* ── Contact link ── */
        .footer-contact-link:hover { color: var(--color-white); }
        .footer-contact-link:focus-visible {
          outline: 3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius: var(--radius-sm);
        }

        /* ── Social icon ── */
        .footer-social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border-dark);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          text-decoration: none;
          transition:
            background   var(--transition-fast),
            color        var(--transition-fast),
            border-color var(--transition-fast);
        }
        .footer-social-icon:hover {
          background:   var(--color-amber-muted);
          color:        var(--color-amber);
          border-color: rgba(232,160,32,0.3);
        }
        .footer-social-icon:focus-visible {
          outline: 3px solid var(--color-amber);
          outline-offset: 3px;
        }

        /* ── Footer grid ── */
        .footer-grid {
          display: grid; grid-template-columns: 1fr;
          gap: var(--space-10);
          justify-items: center;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-10) var(--space-8);
            justify-items: start;
            text-align: left;
          }
          .footer-brand-col { grid-column: span 2; }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: var(--space-12);
            justify-items: start;
          }
          .footer-brand-col { grid-column: span 1; }
        }

        /* ── Brand column — centered on mobile, left at lg+ ── */
        .footer-brand-col {
          display: flex; flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }
        @media (min-width: 640px) {
          .footer-brand-col {
            align-items: flex-start;
            text-align: left;
          }
          .footer-brand-col > div[style*="justifyContent"] {
            justify-content: flex-start !important;
          }
          .footer-brand-col > div:last-child {
            align-items: flex-start;
          }
        }

        /* ── CTA banner inner ── */
        .footer-cta-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-6);
        }
        @media (min-width: 640px) {
          .footer-cta-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-cta-text { flex: 1; }
        .footer-cta-btn {
          width: 100%; flex-shrink: 0; text-align: center;
          max-width: 26rem;
        }
        @media (min-width: 640px) {
          .footer-cta-btn { width: auto; max-width: none; }
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
          padding: var(--space-5) 0 clamp(var(--space-6), 3vw, var(--space-8));
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
          .footer-bottom nav ul { justify-content: flex-start; }
        }
      `}</style>
    </footer>
  );
}