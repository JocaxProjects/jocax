"use client";
// src/components/ProductDetail/ProductGallery.tsx
// Interactive image gallery with thumbnail switching + prev/next arrows.
// Uses Jocax design system CSS variables.

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id:       string;
  imageUrl: string;
  altText:  string | null;
}

interface ProductGalleryProps {
  images:      GalleryImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex];
  const thumbs      = images.slice(0, 6);
  const hasPrev     = activeIndex > 0;
  const hasNext     = activeIndex < images.length - 1;

  function prev() { if (hasPrev) setActiveIndex((i) => i - 1); }
  function next() { if (hasNext) setActiveIndex((i) => i + 1); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* ── Primary image ── */}
      <div
        // Arrow-key navigation: the image region is focusable and responds to
        // left/right keys, matching the expected pattern for image galleries.
        role="region"
        aria-label={`Product images — ${activeIndex + 1} of ${images.length}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
          if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        }}
        style={{
          position:     "relative",
          aspectRatio:  "1 / 1",
          background:   "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          overflow:     "hidden",
          border:       "1.5px solid var(--color-border)",
          outline:      "none",     // focus ring handled below
        }}
        // Visible focus ring so keyboard users know the region is active
        onFocus={(e)  => { e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-amber-muted)"; }}
        onBlur={(e)   => { e.currentTarget.style.boxShadow = "none"; }}
      >
        {activeImage ? (
          <>
            <Image
              src={activeImage.imageUrl}
              alt={activeImage.altText ?? productName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
              style={{ objectFit: "contain", padding: "clamp(0.75rem, 3%, 1.5rem)" }}
              priority
            />

            {/* Image count badge */}
            {images.length > 1 && (
              <div style={{
                position:       "absolute",
                bottom:         "0.75rem",
                right:          "0.75rem",
                background:     "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
                borderRadius:   "var(--radius-full)",
                padding:        "0.25rem 0.625rem",
                fontSize:       "0.6875rem",
                fontFamily:     "var(--font-body)",
                color:          "rgba(255,255,255,0.85)",
                fontWeight:     500,
                letterSpacing:  "0.03em",
                pointerEvents:  "none",
              }}>
                {activeIndex + 1} / {images.length}
              </div>
            )}

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  disabled={!hasPrev}
                  aria-label="Previous image"
                  style={{
                    position:       "absolute",
                    left:           "0.625rem",
                    top:            "50%",
                    transform:      "translateY(-50%)",
                    width:          "2rem",
                    height:         "2rem",
                    background:     "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(4px)",
                    borderRadius:   "var(--radius-full)",
                    border:         "1px solid rgba(255,255,255,0.15)",
                    color:          "rgba(255,255,255,0.85)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    cursor:         hasPrev ? "pointer" : "not-allowed",
                    transition:     "background var(--transition-fast), opacity var(--transition-fast)",
                    opacity:        hasPrev ? 1 : 0.3,
                  }}
                >
                  <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={next}
                  disabled={!hasNext}
                  aria-label="Next image"
                  style={{
                    position:       "absolute",
                    right:          "0.625rem",
                    top:            "50%",
                    transform:      "translateY(-50%)",
                    width:          "2rem",
                    height:         "2rem",
                    background:     "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(4px)",
                    borderRadius:   "var(--radius-full)",
                    border:         "1px solid rgba(255,255,255,0.15)",
                    color:          "rgba(255,255,255,0.85)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    cursor:         hasNext ? "pointer" : "not-allowed",
                    transition:     "background var(--transition-fast), opacity var(--transition-fast)",
                    opacity:        hasNext ? 1 : 0.3,
                  }}
                >
                  <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "0.5rem",
            color:          "var(--color-text-muted)",
          }}>
            <svg style={{ width: "3.5rem", height: "3.5rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
              No image available
            </span>
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {thumbs.length > 1 && (
        <div style={{
          display:             "grid",
          gridTemplateColumns: `repeat(${Math.min(thumbs.length, 6)}, 1fr)`,
          gap:                 "0.5rem",
        }}>
          {thumbs.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={activeIndex === i}
              style={{
                position:    "relative",
                aspectRatio: "1 / 1",
                background:  "var(--color-surface)",
                borderRadius:"var(--radius-md)",
                overflow:    "hidden",
                border:      "2px solid",
                borderColor: activeIndex === i ? "var(--color-amber)" : "var(--color-border)",
                cursor:      "pointer",
                padding:     0,
                transition:  "border-color var(--transition-fast), box-shadow var(--transition-fast)",
                boxShadow:   activeIndex === i ? "0 0 0 3px rgba(232,160,32,0.2)" : "none",
              }}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText ?? `${productName} view ${i + 1}`}
                fill
                sizes="(max-width: 640px) 15vw, 80px"
                style={{ objectFit: "contain", padding: "0.375rem" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}