"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export type NormalizedSlide = {
  id: string;
  title: string;
  description: string;
  image?: string | undefined;
  video?: string | undefined;
  cta?: string | undefined;
  order: number;
  type?: "image" | "video" | "split" | "text-only" | undefined;
};

export type NormalizedReel = {
  id: string;
  title: string;
  description?: string | undefined;
  coverImage?: string | undefined;
  order: number;
  slides: NormalizedSlide[];
};

export type ReelPlayerProps = {
  reels: NormalizedReel[];
  initialReelId?: string | undefined;
  initialSlideIndex?: number | undefined;
  onSlideChange?: ((reelId: string, slideIndex: number) => void) | undefined;
  showReelSelector?: boolean | undefined;
  autoPlay?: boolean | undefined;
  onEscape?: (() => void) | undefined;
};

export default function ReelPlayer({
  reels,
  initialReelId,
  initialSlideIndex = 0,
  onSlideChange,
  showReelSelector = true,
  autoPlay = true,
  onEscape,
}: ReelPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active reel state
  const [activeReelId, setActiveReelId] = useState<string>(initialReelId || reels[0]?.id || "");

  // Find active reel object
  const activeReel = reels.find((r) => r.id === activeReelId) || reels[0];

  // Active slide index state (relative to current reel)
  const [slideIndex, setSlideIndex] = useState<number>(initialSlideIndex);

  // Reset slide index if reel changes
  const handleReelChange = (reelId: string) => {
    setActiveReelId(reelId);
    setSlideIndex(0);
    if (onSlideChange) {
      onSlideChange(reelId, 0);
    }
  };

  const currentSlides = activeReel?.slides || [];
  const currentSlide = currentSlides[slideIndex];

  const handlePrev = useCallback(() => {
    if (slideIndex > 0) {
      const newIdx = slideIndex - 1;
      setSlideIndex(newIdx);
      if (onSlideChange && activeReel) {
        onSlideChange(activeReel.id, newIdx);
      }
    }
  }, [slideIndex, activeReel, onSlideChange]);

  const handleNext = useCallback(() => {
    if (slideIndex < currentSlides.length - 1) {
      const newIdx = slideIndex + 1;
      setSlideIndex(newIdx);
      if (onSlideChange && activeReel) {
        onSlideChange(activeReel.id, newIdx);
      }
    }
  }, [slideIndex, currentSlides.length, activeReel, onSlideChange]);

  // Touch Swipe Gesture State
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX || 0;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX || 0;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Auto-focus container on mount to enable immediate keyboard navigation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Keyboard navigation handler scoped to the component
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Only navigate if the user isn't typing in an input
    const target = e.target as HTMLElement;
    if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "Escape" && onEscape) {
      e.preventDefault();
      onEscape();
    } else if (e.key >= "1" && e.key <= "9") {
      const num = parseInt(e.key, 10) - 1;
      if (num < currentSlides.length) {
        setSlideIndex(num);
        if (onSlideChange && activeReel) {
          onSlideChange(activeReel.id, num);
        }
      }
    }
  };

  if (!activeReel) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--color-text-muted)" }}>
        No reel content available.
      </div>
    );
  }

  const hasMultipleReels = reels.length > 1;

  return (
    <div
      ref={containerRef}
      tabIndex={0} // Makes keyboard listener scope focusable
      onKeyDown={handleKeyDown}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        outline: "none",
      }}
    >
      {/* Reel Selector (v2 conditional tab row) */}
      {hasMultipleReels && showReelSelector && (
        <div
          style={{
            display: "flex",
            gap: 12,
            borderBottom: "1px solid var(--color-border)",
            background: "rgba(0, 0, 0, 0.2)",
            padding: "8px 16px",
            overflowX: "auto",
          }}
        >
          {reels.map((reel) => {
            const isActive = reel.id === activeReelId;
            return (
              <button
                key={reel.id}
                onClick={() => handleReelChange(reel.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                  color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                  padding: "6px 4px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all var(--duration-fast) var(--ease-spring)",
                }}
              >
                {reel.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Slide Presentation Panel */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          flex: 1,
          background: "#000000",
          borderRadius: 8,
          overflow: "hidden",
          maxHeight: 340,
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentSlide ? (
          <ReelSlidePlayer slide={currentSlide} autoPlay={autoPlay} />
        ) : (
          <div style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No slide selected.</div>
        )}
      </div>

      {/* Caption & Description Area */}
      {currentSlide && (
        <div style={{ padding: "12px 0", minHeight: 70 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                {currentSlide.title}
              </h4>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.4",
                }}
              >
                {currentSlide.description}
              </p>
            </div>
            {currentSlide.cta && (
              <a
                href={currentSlide.cta}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "var(--color-accent)",
                  color: "var(--color-text-inverse)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "background var(--duration-fast)",
                }}
              >
                {currentSlide.title.toLowerCase().includes("github") ? "GitHub" : "Link"}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Player Controls (Arrows, Dots, Counter) */}
      {currentSlides.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 8,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={slideIndex === 0}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: slideIndex === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)",
              color: slideIndex === 0 ? "var(--color-text-muted)" : "var(--color-text-primary)",
              opacity: slideIndex === 0 ? 0.3 : 1,
              cursor: slideIndex === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              transition: "all var(--duration-fast)",
            }}
          >
            ←
          </button>

          {/* Dot Indicators */}
          {currentSlides.length <= 8 ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {currentSlides.map((_, i) => {
                const isActive = i === slideIndex;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideIndex(i);
                      if (onSlideChange && activeReel) {
                        onSlideChange(activeReel.id, i);
                      }
                    }}
                    style={{
                      width: isActive ? 8 : 6,
                      height: isActive ? 8 : 6,
                      borderRadius: "50%",
                      border: "none",
                      background: isActive ? "var(--color-accent)" : "rgba(255,255,255,0.3)",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all var(--duration-fast)",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {slideIndex + 1} / {currentSlides.length}
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={slideIndex === currentSlides.length - 1}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background:
                slideIndex === currentSlides.length - 1
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.08)",
              color:
                slideIndex === currentSlides.length - 1
                  ? "var(--color-text-muted)"
                  : "var(--color-text-primary)",
              opacity: slideIndex === currentSlides.length - 1 ? 0.3 : 1,
              cursor: slideIndex === currentSlides.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              transition: "all var(--duration-fast)",
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

type ReelSlidePlayerProps = {
  slide: NormalizedSlide;
  autoPlay: boolean;
};

function ReelSlidePlayer({ slide, autoPlay }: ReelSlidePlayerProps) {
  const isVideo = slide.video !== undefined;
  const isImage = slide.image !== undefined;

  if (isVideo) {
    return (
      <video
        src={slide.video}
        poster={slide.image}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          maxHeight: 340,
          objectFit: "contain",
          background: "#000000",
        }}
      />
    );
  }

  if (isImage) {
    return (
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: 340,
          objectFit: "contain",
          background: "#000000",
        }}
      />
    );
  }

  // Text-only slide fallback
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 24,
        background: "var(--color-bg-card)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          margin: "0 0 12px 0",
        }}
      >
        {slide.title}
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", maxWidth: "80%", margin: 0 }}>
        {slide.description}
      </p>
    </div>
  );
}
