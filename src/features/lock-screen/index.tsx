"use client";

import { useEffect, useState, useCallback } from "react";
import { unlock } from "@core/os-runtime";

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const mm = minutes.toString().padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}

function formatDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export default function LockScreen() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleUnlock = useCallback(() => {
    unlock();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      unlock();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8vh 24px",
        color: "var(--color-text-primary, #f1f5f9)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        overflow: "hidden",
        animation: "my-os-lock-fade-in 0.6s ease-out both",
      }}
      onClick={handleUnlock}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleUnlock();
      }}
    >
      {/* Wallpaper Layer with Blur and Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "var(--wp-bg, linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%))",
          filter: "blur(20px)",
          transform: "scale(1.1)",
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 15, 26, 0.45)",
          zIndex: -1,
        }}
      />

      {/* Clock & Date Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "4vh",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "clamp(64px, 12vw, 80px)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "#ffffff",
          }}
        >
          {formatTime(now)}
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.9)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {formatDate(now)}
        </div>

        {/* Recruiter Notification Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(30, 41, 59, 0.55)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            padding: "8px 16px",
            marginTop: 24,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            animation: "my-os-notification-glow 3s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--color-accent, #10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#ffffff",
            }}
          >
            ✉
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.95)",
              letterSpacing: "0.01em",
            }}
          >
            2 new messages from Recruiters
          </span>
        </div>
      </div>

      {/* Footer Unlock Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginBottom: "2vh",
        }}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 24,
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 600,
            color: "#ffffff",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.22)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "none";
          }}
        >
          <span>🔒</span> Unlock Device
        </button>

        <div
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.35)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            animation: "my-os-lock-pulse 2.4s ease-in-out infinite",
          }}
        >
          Press Enter or space to unlock
        </div>
      </div>

      <style>{`
        @keyframes my-os-lock-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes my-os-lock-pulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.7; }
        }

        @keyframes my-os-notification-glow {
          0%, 100% {
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          }
          50% {
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
          }
        }
      `}</style>
    </div>
  );
}
