"use client";
// src/app/contact/ContactForm.tsx
// Interactive contact / quote request form.
// Handles: field validation, loading state, success state, error state.
// No external form library — pure React state.
// Fully responsive: mobile, tablet, laptop, desktop, all browsers.

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name:        string;
  company:     string;
  email:       string;
  phone:       string;
  subject:     string;
  message:     string;
  preferredContact: "email" | "phone" | "whatsapp";
}

const SUBJECTS = [
  "Request a Quote",
  "Product Inquiry",
  "Technical Support",
  "Installation Services",
  "Spare Parts",
  "Partnership / Distribution",
  "Other",
];

const EMPTY: FormData = {
  name:             "",
  company:          "",
  email:            "",
  phone:            "",
  subject:          "",
  message:          "",
  preferredContact: "email",
};

export default function ContactForm() {
  const [form, setForm]     = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [state, setState]   = useState<FormState>("idle");

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Enter a valid email address";
    if (!form.subject)        e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
                              e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setState("submitting");

    // Simulate async submission (replace with real API call)
    await new Promise(r => setTimeout(r, 1400));

    // TODO: replace with:
    // const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(form) });
    // if (!res.ok) { setState("error"); return; }

    setState("success");
  }

  function reset() {
    setForm(EMPTY);
    setErrors({});
    setState("idle");
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1.5rem", padding: "clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
        textAlign: "center", minHeight: "340px",
      }}>
        {/* Checkmark */}
        <div style={{
          width: "4rem", height: "4rem",
          borderRadius: "var(--radius-full)",
          background: "rgba(22,163,74,0.12)",
          border: "2px solid rgba(22,163,74,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg style={{ width: "1.75rem", height: "1.75rem", color: "rgb(22,163,74)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.375rem, 3vw, 2rem)",
            color: "var(--color-white)", textTransform: "uppercase",
            letterSpacing: "-0.01em", margin: 0,
          }}>
            Message Sent!
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.8125rem, 1.3vw, 0.875rem)",
            color: "rgba(255,255,255,0.5)", marginTop: "0.75rem", lineHeight: 1.7,
          }}>
            Thanks for reaching out. Our team will get back<br />to you within one business day.
          </p>
        </div>
        <button
          onClick={reset}
          style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "var(--text-xs)", letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--color-amber)",
            background: "transparent", border: "none",
            cursor: "pointer", padding: "0.5rem 0",
            borderBottom: "1px solid rgba(232,160,32,0.3)",
            transition: "border-color var(--transition-fast)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* ── Field layout ── */
        .cf-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .cf-label {
          font-family: var(--font-display); font-size: 0.65rem;
          font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .cf-label-required::after {
          content: " *"; color: var(--color-amber); font-size: 0.7rem;
        }

        /* ── Inputs — normalize across browsers ── */
        .cf-input, .cf-select, .cf-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          font-family: var(--font-body); font-size: clamp(0.875rem, 1.3vw, 1rem);
          color: var(--color-white);
          transition: border-color var(--transition-fast), background var(--transition-fast);
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          /* Prevent iOS zoom on focus */
          -webkit-text-size-adjust: 100%;
        }
        /* iOS Safari input zoom fix — min 16px prevents zoom */
        @supports (-webkit-touch-callout: none) {
          .cf-input, .cf-select, .cf-textarea {
            font-size: max(1rem, 16px);
          }
        }
        .cf-input::placeholder, .cf-textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .cf-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        .cf-select option { background: var(--color-steel-mid); color: var(--color-white); }
        .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
          border-color: var(--color-amber);
          background: rgba(232,160,32,0.04);
        }
        .cf-input.error, .cf-select.error, .cf-textarea.error {
          border-color: rgba(220,38,38,0.6);
          background: rgba(220,38,38,0.04);
        }
        .cf-error {
          font-family: var(--font-body); font-size: 0.6875rem;
          color: rgb(248,113,113); font-weight: 500; margin-top: 0.125rem;
        }
        .cf-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

        /* ── Radio buttons ── */
        .cf-radio-group {
          display: flex; gap: 0.625rem; flex-wrap: wrap;
        }
        .cf-radio-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(255,255,255,0.1);
          cursor: pointer; transition: all var(--transition-fast);
          font-family: var(--font-body); font-size: var(--text-xs);
          color: rgba(255,255,255,0.45); font-weight: 600;
          background: transparent; user-select: none;
          letter-spacing: 0.02em;
          -webkit-tap-highlight-color: transparent;
          /* Ensure touch-friendly minimum size */
          min-height: 2.5rem;
          white-space: nowrap;
        }
        .cf-radio-btn.active {
          border-color: var(--color-amber);
          color: var(--color-amber);
          background: rgba(232,160,32,0.08);
        }
        @media (hover: hover) {
          .cf-radio-btn:hover:not(.active) {
            border-color: rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.65);
          }
        }

        /* ── Two-column row — stacks to one column on mobile ── */
        .cf-row {
          display: grid; grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 480px) { .cf-row { grid-template-columns: 1fr 1fr; } }

        /* ── Submit button ── */
        .cf-submit {
          width: 100%; padding: clamp(0.875rem, 2vw, 1rem) 2rem;
          background: var(--color-amber); color: var(--color-ink);
          font-family: var(--font-display); font-weight: 800;
          font-size: var(--text-sm); letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none; border-radius: var(--radius-md);
          cursor: pointer; transition: background var(--transition-fast), transform var(--transition-fast);
          display: flex; align-items: center; justify-content: center; gap: 0.625rem;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          /* Minimum touch target */
          min-height: 3rem;
        }
        @media (hover: hover) {
          .cf-submit:hover:not(:disabled) {
            background: var(--color-amber-light);
            transform: translateY(-1px);
          }
        }
        .cf-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .cf-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .cf-spinner {
          width: 1rem; height: 1rem; border-radius: 50%;
          border: 2px solid rgba(13,13,13,0.3);
          border-top-color: var(--color-ink);
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Name + Company */}
        <div className="cf-row">
          <div className="cf-field">
            <label className="cf-label cf-label-required">Full Name</label>
            <input
              className={`cf-input${errors.name ? " error" : ""}`}
              type="text" placeholder="Jane Mwangi"
              value={form.name} onChange={e => set("name", e.target.value)}
              autoComplete="name"
              inputMode="text"
            />
            {errors.name && <span className="cf-error" role="alert">{errors.name}</span>}
          </div>
          <div className="cf-field">
            <label className="cf-label">Company / Organisation</label>
            <input
              className="cf-input"
              type="text" placeholder="Serena Hotels Ltd"
              value={form.company} onChange={e => set("company", e.target.value)}
              autoComplete="organization"
              inputMode="text"
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="cf-row">
          <div className="cf-field">
            <label className="cf-label cf-label-required">Email Address</label>
            <input
              className={`cf-input${errors.email ? " error" : ""}`}
              type="email" placeholder="jane@example.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {errors.email && <span className="cf-error" role="alert">{errors.email}</span>}
          </div>
          <div className="cf-field">
            <label className="cf-label">Phone / WhatsApp</label>
            <input
              className="cf-input"
              type="tel" placeholder="+254 700 000 000"
              value={form.phone} onChange={e => set("phone", e.target.value)}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="cf-field">
          <label className="cf-label cf-label-required">Subject</label>
          <select
            className={`cf-select${errors.subject ? " error" : ""}`}
            value={form.subject}
            onChange={e => set("subject", e.target.value)}
          >
            <option value="">Select a topic…</option>
            {SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.subject && <span className="cf-error" role="alert">{errors.subject}</span>}
        </div>

        {/* Message */}
        <div className="cf-field">
          <label className="cf-label cf-label-required">Message</label>
          <textarea
            className={`cf-textarea${errors.message ? " error" : ""}`}
            placeholder="Tell us about your kitchen operation and what you need…"
            value={form.message}
            onChange={e => set("message", e.target.value)}
          />
          {errors.message && <span className="cf-error" role="alert">{errors.message}</span>}
        </div>

        {/* Preferred contact */}
        <div className="cf-field">
          <label className="cf-label">Preferred Contact Method</label>
          <div className="cf-radio-group" role="group" aria-label="Preferred contact method">
            {(["email", "phone", "whatsapp"] as const).map(opt => (
              <button
                key={opt} type="button"
                className={`cf-radio-btn${form.preferredContact === opt ? " active" : ""}`}
                onClick={() => set("preferredContact", opt)}
                aria-pressed={form.preferredContact === opt}
              >
                {opt === "email" && (
                  <svg style={{ width: "0.75rem", height: "0.75rem", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {opt === "phone" && (
                  <svg style={{ width: "0.75rem", height: "0.75rem", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
                {opt === "whatsapp" && (
                  <svg style={{ width: "0.75rem", height: "0.75rem", flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                )}
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {state === "error" && (
          <div role="alert" style={{
            padding: "0.875rem 1rem",
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.25)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            color: "rgb(248,113,113)",
          }}>
            Something went wrong. Please try again or email us directly.
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="cf-submit" disabled={state === "submitting"}>
          {state === "submitting" ? (
            <>
              <span className="cf-spinner" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <svg style={{ width: "1rem", height: "1rem", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message
            </>
          )}
        </button>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.6875rem",
          color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6,
          margin: 0,
        }}>
          We typically respond within one business day.
          Your information is never shared with third parties.
        </p>
      </form>
    </>
  );
}