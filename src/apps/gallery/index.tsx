"use client";

import React, { useState, useCallback, useEffect } from "react";
import { getGalleryImages, GalleryImage } from "@data/gallery";

export default function GalleryApp() {
  const [images] = useState<GalleryImage[]>(getGalleryImages());
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const openLightbox = useCallback((image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setLightboxIndex(0);
  }, []);

  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "prev"
      ? (currentIndex - 1 + images.length) % images.length
      : (currentIndex + 1) % images.length;

    const nextImage = images[newIndex];
    if (nextImage) {
      setSelectedImage(nextImage);
      setLightboxIndex(newIndex);
    }
  }, [images, selectedImage]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev");
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, closeLightbox, navigateLightbox]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .gallery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          padding: 0 20px;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-sidebar);
        }
        .gallery-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
        }
        .gallery-count {
          font-size: 12px;
          color: var(--color-text-muted);
        }
        .gallery-grid {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: rgba(18, 25, 40, 0.8);
        }
        .gallery-grid-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .gallery-item {
          position: relative;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .gallery-item:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .gallery-item-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: var(--color-surface-1);
        }
        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10, 15, 26, 0.95) 100%);
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 12px;
          transition: opacity var(--duration-fast) var(--ease-spring);
        }
        .gallery-item:hover .gallery-item-overlay {
          opacity: 1;
        }
        .gallery-item-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gallery-item-meta {
          font-size: 10px;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
        .gallery-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
        }
        .gallery-item-tag {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 4px;
          background: var(--color-surface-1);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 26, 0.95);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn var(--duration-fast) var(--ease-spring);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox-container {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        }
        .lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .lightbox-close:hover {
          background: var(--color-win-close);
          border-color: var(--color-win-close);
          color: white;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .lightbox-nav:hover {
          background: var(--color-surface-2);
          border-color: var(--color-border-focus);
        }
        .lightbox-nav.prev {
          left: -68px;
        }
        .lightbox-nav.next {
          right: -68px;
        }
        .lightbox-info {
          margin-top: 16px;
          text-align: center;
          max-width: 600px;
        }
        .lightbox-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }
        .lightbox-description {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
        }
        .lightbox-meta {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .lightbox-counter {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: 8px;
        }
        .lightbox-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          margin-top: 12px;
        }
        .lightbox-tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--color-surface-1);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        /* Empty state */
        .gallery-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-text-secondary);
          padding: 24px;
          text-align: center;
        }
        .gallery-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .gallery-empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }
        .gallery-empty-hint {
          font-size: 12px;
          line-height: 1.6;
        }

        /* Responsive grid */
        @media (max-width: 1200px) {
          .gallery-grid-inner {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) {
          .gallery-grid-inner {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .gallery-grid-inner {
            grid-template-columns: 1fr;
          }
        }

        /* Lightbox responsive */
        @media (max-width: 768px) {
          .lightbox-nav.prev {
            left: -58px;
          }
          .lightbox-nav.next {
            right: -58px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="gallery-header">
        <div className="gallery-title">Gallery</div>
        <div className="gallery-count">{images.length} images</div>
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {images.length > 0 ? (
          <div className="gallery-grid-inner">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image, index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(image, index);
                  }
                }}
              >
                <img
                  className="gallery-item-image"
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                />
                <div className="gallery-item-overlay">
                  <div className="gallery-item-title">{image.title}</div>
                  <div className="gallery-item-meta">{image.date}</div>
                  {image.tags && image.tags.length > 0 && (
                    <div className="gallery-item-tags">
                      {image.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="gallery-item-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">🖼️</div>
            <div className="gallery-empty-title">No images yet</div>
            <div className="gallery-empty-hint">Add images to <code>src/data/gallery.ts</code> to populate the gallery</div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image preview">
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav prev"
                  onClick={() => navigateLightbox("prev")}
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={() => navigateLightbox("next")}
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}
            <img
              className="lightbox-image"
              src={selectedImage.src}
              alt={selectedImage.alt}
            />
            <div className="lightbox-info">
              <div className="lightbox-title">{selectedImage.title}</div>
              {selectedImage.description && (
                <div className="lightbox-description">{selectedImage.description}</div>
              )}
              <div className="lightbox-meta">{selectedImage.date}</div>
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="lightbox-tags">
                  {selectedImage.tags.map((tag) => (
                    <span key={tag} className="lightbox-tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}