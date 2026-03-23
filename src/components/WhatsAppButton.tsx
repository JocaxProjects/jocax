"use client";

// components/global/WhatsAppButton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global floating WhatsApp CTA — fixed bottom-right on all pages.
// • Matches Jocax dark + amber/gold brand tokens exactly
// • Pulse ring animation draws attention without being intrusive
// • Tooltip on hover with pre-filled message
// • Hides on scroll down, reappears on scroll up (avoids blocking content)
// • Fully accessible: role, aria-label, keyboard, focus-visible
// • Respects prefers-reduced-motion
// • Mobile-first, works across all breakpoints
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "254725692649"; // no + or spaces
const PREFILL_MESSAGE = encodeURIComponent(
  "Hi Jocax Solutions! I'd like to enquire about your commercial kitchen equipment."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILL_MESSAGE}`;

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(true);
  const [tooltip, setTooltip] = useState(false);
  const [nudge, setNudge]     = useState(false);
  const lastScrollY           = useRef(0);
  // Plain object avoids TypeScript generic annotations that some
  // Next.js / Turbopack builds misparse as JSX in .tsx files
  const nudgeTimerId = { current: null as NodeJS.Timeout | null };

  /* ── Hide on scroll-down, show on scroll-up ── */
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY.current || current < 80);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Gentle nudge animation every 8 s to catch attention ── */
  useEffect(() => {
    const schedule = () => {
      nudgeTimerId.current = setTimeout(() => {
        setNudge(true);
        setTimeout(() => setNudge(false), 600);
        schedule();
      }, 8000);
    };
    schedule();
    return () => {
      if (nudgeTimerId.current) clearTimeout(nudgeTimerId.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={`wa-wrapper${visible ? " wa-wrapper--visible" : " wa-wrapper--hidden"}`}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
      >
        {/* ── Tooltip ── */}
        <div
          className={`wa-tooltip${tooltip ? " wa-tooltip--show" : ""}`}
          aria-hidden="true"
        >
          <span className="wa-tooltip__dot" />
          <span className="wa-tooltip__body">
            <span className="wa-tooltip__title">Get a Free Quote</span>
            <span className="wa-tooltip__sub">Specialists reply in minutes</span>
          </span>
        </div>

        {/* ── Pulse rings ── */}
        <span className="wa-pulse wa-pulse--1" aria-hidden="true" />
        <span className="wa-pulse wa-pulse--2" aria-hidden="true" />

        {/* ── Button ── */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Jocax Solutions on WhatsApp — opens in new tab"
          className={`wa-btn${nudge ? " wa-btn--nudge" : ""}`}
        >
          {/* WhatsApp SVG icon */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="wa-icon"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      <style href="whatsapp-button" precedence="default">{`
        /* ── Wrapper — fixed position ── */
        .wa-wrapper {
          position:        fixed;
          bottom:          clamp(20px, 4vw, 32px);
          right:           clamp(16px, 4vw, 32px);
          z-index:         9999;
          display:         flex;
          align-items:     center;
          justify-content: center;
          /* transition handles show/hide */
          transition:
            opacity   0.35s ease,
            transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .wa-wrapper--visible {
          opacity:   1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .wa-wrapper--hidden {
          opacity:   0;
          transform: translateY(16px) scale(0.9);
          pointer-events: none;
        }

        /* ── Main button ── */
        .wa-btn {
          position:        relative;
          z-index:         2;
          display:         flex;
          align-items:     center;
          justify-content: center;
          width:           clamp(52px, 7vw, 62px);
          height:          clamp(52px, 7vw, 62px);
          border-radius:   50%;
          background:      #25D366;
          color:           #fff;
          text-decoration: none;
          box-shadow:
            0 4px 16px rgba(37, 211, 102, 0.45),
            0 2px 6px  rgba(0, 0, 0, 0.35);
          transition:
            transform  var(--transition-fast, 0.18s ease),
            box-shadow var(--transition-fast, 0.18s ease),
            background var(--transition-fast, 0.18s ease);
          /* Amber ring on focus — matches brand */
          outline: none;
        }
        .wa-btn:hover {
          background:  #1ebe5d;
          transform:   scale(1.10);
          box-shadow:
            0 6px 24px rgba(37, 211, 102, 0.55),
            0 3px 8px  rgba(0, 0, 0, 0.40);
        }
        .wa-btn:focus-visible {
          outline:        3px solid var(--color-amber, #E8A020);
          outline-offset: 4px;
        }
        .wa-btn:active {
          transform: scale(0.96);
        }

        /* Nudge: quick lateral wiggle to recapture attention */
        .wa-btn--nudge {
          animation: waNudge 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes waNudge {
          0%, 100% { transform: rotate(0deg)   scale(1);    }
          20%       { transform: rotate(-8deg)  scale(1.08); }
          40%       { transform: rotate(6deg)   scale(1.06); }
          60%       { transform: rotate(-4deg)  scale(1.04); }
          80%       { transform: rotate(2deg)   scale(1.02); }
        }

        /* ── WhatsApp icon ── */
        .wa-icon {
          width:  clamp(26px, 3.5vw, 32px);
          height: clamp(26px, 3.5vw, 32px);
          flex-shrink: 0;
        }

        /* ── Pulse rings ── */
        .wa-pulse {
          position:      absolute;
          border-radius: 50%;
          background:    rgba(37, 211, 102, 0.28);
          animation:     waPulse 2.8s ease-out infinite;
          pointer-events: none;
        }
        .wa-pulse--1 {
          width:  clamp(52px, 7vw, 62px);
          height: clamp(52px, 7vw, 62px);
          animation-delay: 0s;
        }
        .wa-pulse--2 {
          width:  clamp(52px, 7vw, 62px);
          height: clamp(52px, 7vw, 62px);
          animation-delay: 0.9s;
        }
        @keyframes waPulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(2.2);  opacity: 0;   }
        }

        /* ── Tooltip ── */
        .wa-tooltip {
          position:       absolute;
          right:          calc(100% + 16px);
          top:            50%;
          transform:      translateY(-50%) translateX(8px);
          background:     rgba(10, 10, 10, 0.97);
          border:         1px solid rgba(232, 160, 32, 0.30);
          border-left:    3px solid #E8A020;
          color:          #fff;
          white-space:    nowrap;
          padding:        12px 16px 12px 14px;
          border-radius:  10px;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.5),
            0 0 0 1px rgba(232,160,32,0.08);
          pointer-events: none;
          opacity:        0;
          transition:
            opacity   0.22s ease,
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          display:        flex;
          align-items:    center;
          gap:            12px;
        }
        /* Arrow pointing right */
        .wa-tooltip::after {
          content:      "";
          position:     absolute;
          right:        -6px;
          top:          50%;
          transform:    translateY(-50%) rotate(45deg);
          width:        10px;
          height:       10px;
          background:   rgba(10, 10, 10, 0.97);
          border-right: 1px solid rgba(232, 160, 32, 0.30);
          border-top:   1px solid rgba(232, 160, 32, 0.30);
        }
        .wa-tooltip--show {
          opacity:   1;
          transform: translateY(-50%) translateX(0);
        }
        /* Body: stacked title + subline */
        .wa-tooltip__body {
          display:        flex;
          flex-direction: column;
          gap:            3px;
        }
        .wa-tooltip__title {
          display:        block;
          font-size:      13px;
          font-weight:    700;
          letter-spacing: 0.03em;
          color:          #fff;
          line-height:    1.3;
        }
        .wa-tooltip__sub {
          display:        block;
          font-size:      11px;
          font-weight:    400;
          letter-spacing: 0.01em;
          color:          rgba(255,255,255,0.55);
          line-height:    1.3;
        }
        /* Online dot */
        .wa-tooltip__dot {
          display:       inline-block;
          width:         8px;
          height:        8px;
          border-radius: 50%;
          background:    #25D366;
          flex-shrink:   0;
          box-shadow:    0 0 6px rgba(37,211,102,0.7);
          animation:     waOnline 2s ease-in-out infinite;
        }
        @keyframes waOnline {
          0%, 100% { opacity: 1;   box-shadow: 0 0 6px rgba(37,211,102,0.7); }
          50%       { opacity: 0.5; box-shadow: 0 0 2px rgba(37,211,102,0.3); }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .wa-pulse          { animation: none; }
          .wa-btn--nudge     { animation: none; }
          .wa-tooltip        { transition: opacity 0.1s; }
          .wa-wrapper        { transition: opacity 0.2s; }
          .wa-tooltip__dot   { animation: none; }
        }

        /* ── Slightly smaller on very small screens ── */
        @media (max-width: 359px) {
          .wa-btn    { width: 48px; height: 48px; }
          .wa-icon   { width: 24px; height: 24px; }
          .wa-pulse--1,
          .wa-pulse--2 { width: 48px; height: 48px; }
          .wa-tooltip  { display: none; }
        }
      `}</style>
    </>
  );
}