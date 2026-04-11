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
  { href: "/about",    label: "About Us" },
  { href: "/catalog",  label: "Catalog"  },
  { href: "/search",   label: "Search"   },
  { href: "/contact",  label: "Contact"  },
];

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com", label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
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
  {
    href: "https://tiktok.com", label: "TikTok",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
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

// ─── FooterSupportContact ─────────────────────────────────────────────────────

function FooterSupportContact() {
  return (
    <div className="footer-link-group">
      <p className="eyebrow-light footer-link-heading">Contact</p>
      <div className="footer-support-cards">
        <a
          href="mailto:hello@jocaxsolutions.co.ke"
          className="footer-support-card"
          aria-label="Email Jocax Solutions support"
        >
          <span className="footer-support-card__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </span>
          <span className="footer-support-card__content">
            <span className="footer-support-card__label">Email us</span>
            <span className="footer-support-card__value">hello@jocaxsolutions.co.ke</span>
          </span>
        </a>

        <a
          href="tel:+254725692649"
          className="footer-support-card"
          aria-label="Call Jocax Solutions support"
        >
          <span className="footer-support-card__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <span className="footer-support-card__content">
            <span className="footer-support-card__label">Call us</span>
            <span className="footer-support-card__value">+254 725 692 649</span>
          </span>
        </a>
      </div>
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

          </div>

          {/* ── Link columns ─────────────────────────────────────────── */}
          <FooterLinkGroup heading="Catalog" links={FOOTER_CATALOG} />
          <FooterLinkGroup heading="Company" links={FOOTER_COMPANY} />
          <FooterSupportContact />

        </div>

        {/* Divider */}
        <hr className="divider"
          style={{ margin: "clamp(var(--space-8), 4vw, var(--space-12)) 0 0" }}/>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <small style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Jocax Solutions Limited. All rights reserved.
          </small>

          <a
            href="https://brandlynkdigitalsolutions.co.ke/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-brandlynk"
            aria-label="Designed by Brandlynk Digital Solutions — opens in new tab"
          >
            <span className="footer-brandlynk__prefix">Designed by</span>
            <span className="footer-brandlynk__name">Brandlynk</span>
          </a>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════════════════════════ */}
      <style href="jx-footer" precedence="default">{`

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
          filter: url(#footer-logo-recolor);
        }
        @media (max-width: 359px) {
          .footer-logo-img { height: 34px; }
        }
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

        /* ── Support contact cards ── */
        .footer-support-cards {
          display:        flex;
          flex-direction: column;
          gap:            var(--space-3);
          width:          100%;
          align-items:    center;
        }
        @media (min-width: 1024px) {
          .footer-support-cards { align-items: flex-start; }
        }
        .footer-support-card {
          display:         flex;
          align-items:     center;
          gap:             var(--space-3);
          padding:         var(--space-3) var(--space-4);
          background:      rgba(255, 255, 255, 0.04);
          border:          1px solid rgba(255, 255, 255, 0.07);
          border-radius:   var(--radius-md);
          text-decoration: none;
          min-height:      52px;
          width:           100%;
          max-width:       280px;
          transition:
            background    var(--transition-fast),
            border-color  var(--transition-fast),
            transform     var(--transition-fast);
        }
        .footer-support-card:hover {
          background:   rgba(232, 160, 32, 0.08);
          border-color: rgba(232, 160, 32, 0.30);
          transform:    translateX(3px);
        }
        .footer-support-card:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-md);
        }
        .footer-support-card__icon {
          display:         flex;
          align-items:     center;
          justify-content: center;
          width:           34px;
          height:          34px;
          background:      rgba(232, 160, 32, 0.12);
          border:          1px solid rgba(232, 160, 32, 0.20);
          border-radius:   var(--radius-sm);
          color:           var(--color-amber, #E8A020);
          flex-shrink:     0;
          transition:      background var(--transition-fast);
        }
        .footer-support-card:hover .footer-support-card__icon {
          background: rgba(232, 160, 32, 0.22);
        }
        .footer-support-card__content {
          display:        flex;
          flex-direction: column;
          gap:            2px;
          min-width:      0;
        }
        .footer-support-card__label {
          display:        block;
          font-size:      10px;
          font-weight:    700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color:          var(--color-amber, #E8A020);
          line-height:    1;
        }
        .footer-support-card__value {
          display:       block;
          font-size:     var(--text-sm);
          font-weight:   500;
          color:         rgba(255, 255, 255, 0.80);
          line-height:   1.3;
          white-space:   nowrap;
          overflow:      hidden;
          text-overflow: ellipsis;
        }
        .footer-support-card:hover .footer-support-card__value {
          color: var(--color-white);
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
        }

        /* ── Brandlynk credit ── */
        .footer-brandlynk {
          display:         inline-flex;
          align-items:     center;
          gap:             var(--space-1);
          text-decoration: none;
          transition:      opacity var(--transition-fast);
        }
        .footer-brandlynk:hover { opacity: 0.8; }
        .footer-brandlynk:focus-visible {
          outline:        3px solid var(--color-amber);
          outline-offset: 3px;
          border-radius:  var(--radius-sm);
        }
        .footer-brandlynk__prefix {
          font-size:   var(--text-sm);
          color:       var(--color-text-muted);
          font-weight: 400;
        }
        .footer-brandlynk__name {
          font-size:      var(--text-sm);
          font-weight:    700;
          color:          var(--color-amber, #E8A020);
          letter-spacing: 0.02em;
        }
      `}</style>
    </footer>
  );
}