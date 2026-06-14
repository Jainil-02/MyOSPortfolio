"use client";

import React from "react";
import { openWindow, focusWindow, listWindows } from "@core/window-manager";
import { setActiveApp } from "@core/os-runtime";

export default function Home() {
  const handleOpenApp = (id: string, title: string) => {
    const windows = listWindows();
    const existing = windows.find((w) => w.appId === id);
    setActiveApp(id);
    if (existing) {
      focusWindow(existing.id);
    } else {
      openWindow({
        id: `${id}-window`,
        title,
        appId: id,
        focused: true,
        minimized: false,
        maximized: false,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#f1f5f9",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 32,
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "32px 40px",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          maxWidth: 480,
          width: "100%",
        }}
      >
        <h1
          style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}
        >
          Welcome to MyOS
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.5, margin: "0 0 24px 0" }}>
          An immersive, interactive operating system experience showcasing Jainil Pandya&apos;s
          developer portfolio, projects, and bio.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => handleOpenApp("about", "About")}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            Read About MyOS
          </button>

          <button
            onClick={() => handleOpenApp("projects", "Projects")}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              transition: "transform 0.15s, opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Explore Projects
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: "#64748b" }}>
          Double-click desktop icons or use the dock launcher to explore more.
        </div>
      </div>
    </div>
  );
}
