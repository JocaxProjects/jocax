"use client";
// src/components/ProductDetail/ProductTabs.tsx
// Tabbed panel: Description / Specifications / Documents.
// Uses Jocax design system CSS variables. Fully responsive.

import { useState, useMemo } from "react";

interface Attribute {
  id:        string;
  value:     string;
  attribute: { name: string; unit: string | null };
}

interface Document {
  id:           string;
  title:        string;
  documentUrl:  string;
  documentType: string | null;
}

interface ProductTabsProps {
  description: string | null | undefined;
  attributes:  Attribute[];
  documents:   Document[];
}

// ─── Document type helpers ────────────────────────────────────────────────────
// Matching is done via .includes() on the lowercased type string.
// The direct-key lookup path (DOC_TYPE_META[type]) was removed — it was dead
// code because no documentType in the seed exactly matches "manual", "spec",
// or "cert". The includes() fallback handles all real values.

interface DocMeta {
  label: string;
  color: string;
  bg:    string;
  icon:  string;
}

const DOC_MANUAL: DocMeta  = {
  label: "Manual",      color: "rgb(29,78,216)",           bg: "rgba(59,130,246,0.1)",
  icon:  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
};
const DOC_SPEC: DocMeta = {
  label: "Spec Sheet",  color: "rgb(6,95,70)",             bg: "rgba(16,185,129,0.1)",
  icon:  "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};
const DOC_CERT: DocMeta = {
  label: "Certificate", color: "rgb(120,53,15)",           bg: "rgba(245,158,11,0.1)",
  icon:  "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
};
const DOC_DEFAULT: DocMeta = {
  label: "Document",    color: "var(--color-text-muted)",  bg: "var(--color-surface-alt)",
  icon:  "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
};

function getDocMeta(type: string | null): DocMeta {
  if (!type) return DOC_DEFAULT;
  const t = type.toLowerCase();
  if (t.includes("manual")) return DOC_MANUAL;
  if (t.includes("spec"))   return DOC_SPEC;
  if (t.includes("cert"))   return DOC_CERT;
  return DOC_DEFAULT;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductTabs({ description, attributes, documents }: ProductTabsProps) {
  // Derive the tab list from props. useMemo keeps the reference stable so
  // tabIds computed below doesn't produce a new array on every render.
  const tabs = useMemo(() => [
    description           ? { id: "description", label: "Description" }                            : null,
    attributes.length > 0 ? { id: "specs",       label: "Specifications", count: attributes.length } : null,
    documents.length > 0  ? { id: "documents",   label: "Downloads",      count: documents.length  } : null,
  ].filter(Boolean) as { id: string; label: string; count?: number }[], [description, attributes, documents]);

  // Store the user's intended choice. May temporarily point to a tab that
  // doesn't exist if props change — resolved inline below, no effect needed.
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.id ?? "description");

  // Derived active tab — computed on every render, never stale.
  // If selectedTab is no longer in the current tab list (props changed),
  // fall back to the first available tab without any setState call.
  const tabIds    = tabs.map((t) => t.id);
  const activeTab = tabIds.includes(selectedTab) ? selectedTab : (tabs[0]?.id ?? "description");

  if (tabs.length === 0) return null;

  return (
    <div style={{
      marginTop:    "clamp(2rem, 6vw, 3.5rem)",
      background:   "var(--color-surface)",
      border:       "1.5px solid var(--color-border)",
      borderRadius: "var(--radius-xl)",
      overflow:     "hidden",
    }}>

      {/* ── Tab bar ── */}
      <div
        role="tablist"
        aria-label="Product information"
        style={{
          display:         "flex",
          borderBottom:    "1.5px solid var(--color-border)",
          background:      "var(--color-catalog-bg)",
          overflowX:       "auto",
          msOverflowStyle: "none",
          scrollbarWidth:  "none",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "0.5rem",
              padding:        "clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)",
              flexShrink:     0,
              cursor:         "pointer",
              fontFamily:     "var(--font-display)",
              fontWeight:     600,
              fontSize:       "var(--text-xs)",
              letterSpacing:  "var(--tracking-wide)",
              textTransform:  "uppercase",
              background:     "transparent",
              border:         "none",
              borderBottom:   "2.5px solid",
              borderBottomColor: activeTab === tab.id ? "var(--color-amber)" : "transparent",
              color:          activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              transition:     "color var(--transition-fast), border-color var(--transition-fast)",
              marginBottom:   "-1.5px",
            }}
          >
            {tab.label}
            {tab.count != null && (
              <span style={{
                fontSize:     "0.625rem",
                fontWeight:   700,
                background:   activeTab === tab.id ? "var(--color-amber)" : "var(--color-border)",
                color:        activeTab === tab.id ? "var(--color-ink)"   : "var(--color-text-muted)",
                borderRadius: "var(--radius-full)",
                padding:      "0.1rem 0.4rem",
                transition:   "background var(--transition-fast), color var(--transition-fast)",
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      <div style={{ padding: "clamp(1.25rem, 4vw, 2rem)" }}>

        {/* Description */}
        {activeTab === "description" && description && (
          <div
            role="tabpanel"
            id="tabpanel-description"
            aria-labelledby="tab-description"
            style={{
              fontSize:   "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color:      "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
              whiteSpace: "pre-line",
              maxWidth:   "72ch",
            }}
          >
            {description}
          </div>
        )}

        {/* Specifications */}
        {activeTab === "specs" && attributes.length > 0 && (
          <div
            role="tabpanel"
            id="tabpanel-specs"
            aria-labelledby="tab-specs"
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 18rem), 1fr))",
              gap:                 "0.375rem",
            }}
          >
            {attributes.map((attr, i) => (
              <div key={attr.id} style={{
                display:        "flex",
                alignItems:     "baseline",
                justifyContent: "space-between",
                gap:            "0.75rem",
                padding:        "0.625rem 0.875rem",
                background:     i % 2 === 0 ? "var(--color-catalog-bg)" : "var(--color-surface)",
                borderRadius:   "var(--radius-md)",
                border:         "1px solid var(--color-border)",
              }}>
                <span style={{
                  fontSize:   "var(--text-xs)",
                  fontWeight: 500,
                  color:      "var(--color-text-muted)",
                  fontFamily: "var(--font-body)",
                  flexShrink: 0,
                }}>
                  {attr.attribute.name}
                </span>
                <span style={{
                  fontSize:   "var(--text-sm)",
                  fontWeight: 600,
                  color:      "var(--color-text-primary)",
                  fontFamily: "var(--font-body)",
                  textAlign:  "right",
                }}>
                  {attr.value}
                  {attr.attribute.unit && (
                    <span style={{
                      marginLeft: "0.25rem",
                      fontSize:   "var(--text-xs)",
                      color:      "var(--color-text-muted)",
                      fontWeight: 400,
                    }}>
                      {attr.attribute.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {activeTab === "documents" && documents.length > 0 && (
          <div
            role="tabpanel"
            id="tabpanel-documents"
            aria-labelledby="tab-documents"
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 22rem), 1fr))",
              gap:                 "0.625rem",
            }}
          >
            {documents.map((doc) => {
              const meta = getDocMeta(doc.documentType);
              return (
                <a
                  key={doc.id}
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    gap:            "0.875rem",
                    padding:        "0.875rem 1rem",
                    background:     "var(--color-catalog-bg)",
                    border:         "1.5px solid var(--color-border)",
                    borderRadius:   "var(--radius-lg)",
                    textDecoration: "none",
                    transition:     "border-color var(--transition-fast), background var(--transition-fast)",
                    cursor:         "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-amber)";
                    (e.currentTarget as HTMLElement).style.background   = "rgba(232,160,32,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    (e.currentTarget as HTMLElement).style.background   = "var(--color-catalog-bg)";
                  }}
                >
                  <div style={{
                    width:          "2.5rem",
                    height:         "2.5rem",
                    flexShrink:     0,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    background:     meta.bg,
                    borderRadius:   "var(--radius-md)",
                  }}>
                    <svg style={{ width: "1.125rem", height: "1.125rem", color: meta.color }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={meta.icon} />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize:     "var(--text-sm)",
                      fontWeight:   600,
                      color:        "var(--color-text-primary)",
                      fontFamily:   "var(--font-body)",
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace:   "nowrap",
                      margin:       0,
                    }}>
                      {doc.title}
                    </p>
                    {doc.documentType && (
                      <span style={{
                        fontSize:      "0.6875rem",
                        fontFamily:    "var(--font-body)",
                        color:         "var(--color-text-muted)",
                        fontWeight:    500,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}>
                        {doc.documentType}
                      </span>
                    )}
                  </div>

                  <svg style={{ width: "1rem", height: "1rem", color: "var(--color-text-muted)", flexShrink: 0 }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}