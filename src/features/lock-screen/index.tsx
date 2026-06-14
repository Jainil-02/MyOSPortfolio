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
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
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
        justifyContent: "center",
        background: "var(--wp-bg, linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%))",
        color: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        animation: "my-os-lock-fade-in 0.6s ease-out both",
      }}
      onClick={handleUnlock}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleUnlock();
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "clamp(64px, 15vw, 120px)",
            fontWeight: 250,
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#ffffff",
            animation: "my-os-lock-clock-glow 4s ease-in-out infinite",
          }}
        >
          {formatTime(now)}
        </div>

        <div
          style={{
            fontSize: "clamp(16px, 3vw, 22px)",
            fontWeight: 400,
            color: "rgba(241, 245, 249, 0.7)",
            letterSpacing: "0.02em",
          }}
        >
          {formatDate(now)}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(40px, 8vh, 80px)",
          fontSize: "clamp(13px, 2vw, 15px)",
          fontWeight: 300,
          color: "rgba(241, 245, 249, 0.4)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          pointerEvents: "none",
          animation: "my-os-lock-pulse 2.4s ease-in-out infinite",
        }}
      >
        Tap anywhere to unlock
      </div>

      <style>{`
        @keyframes my-os-lock-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes my-os-lock-clock-glow {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.85; }
        }

        @keyframes my-os-lock-pulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
