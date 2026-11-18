"use client";

import React, { useState, useSyncExternalStore } from "react";
import { getSettings, updateSettings, subscribeToSettings } from "@core/settings";
import AppSidebar from "../../shared/ui/AppSidebar";
import AppContentArea from "../../shared/ui/AppContentArea";

type SettingsTab = "general" | "appearance" | "network" | "security";

const WALLPAPERS = [
  {
    id: "dark-blue",
    name: "Deep Slate Waves",
    value: "linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%)",
  },
  {
    id: "midnight-breeze",
    name: "Midnight Breeze",
    value: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  },
  {
    id: "purple-sunset",
    name: "Purple Sunset",
    value: "linear-gradient(135deg, #311042 0%, #6b21a8 50%, #180828 100%)",
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    value: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)",
  },
];

const ACCENT_COLORS = [
  { color: "#10b981", name: "Teal" },
  { color: "#3b82f6", name: "Blue" },
  { color: "#8b5cf6", name: "Purple" },
  { color: "#ec4899", name: "Pink" },
  { color: "#f59e0b", name: "Amber" },
  { color: "#f97316", name: "Orange" },
];

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const settings = useSyncExternalStore(subscribeToSettings, getSettings, () => ({
    wallpaper: "linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%)",
    wallpaperVariant: "dark" as const,
    theme: "dark" as const,
    lockScreenEnabled: true,
    accentColor: "#10b981",
  }));

  const handleWallpaperChange = (val: string) => {
    updateSettings({ wallpaper: val });
  };

  const handleToggleLockscreen = () => {
    updateSettings({ lockScreenEnabled: !settings.lockScreenEnabled });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 10px 0",
                }}
              >
                SYSTEM INFORMATION
              </h2>
              <div
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  padding: 16,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td
                        style={{
                          padding: "8px 0",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        OS Name
                      </td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>
                        ApexOS (Portfolio Edition)
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td
                        style={{
                          padding: "8px 0",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        OS Version
                      </td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>3.0.0-release</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td
                        style={{
                          padding: "8px 0",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        Processor
                      </td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>
                        Virtual V8 Web Core Engine
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: "8px 0",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        Memory
                      </td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>
                        React Shared State Context
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 10px 0",
                }}
              >
                ABOUT DEVELOPER
              </h2>
              <div
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  padding: 16,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                ApexOS was architected and built by <strong>Jainil Pandya</strong> as a flagship
                portfolio platform to display projects, resumes, and contact links in a unified,
                immersive, desktop-like environment.
              </div>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Wallpaper Selection */}
            <div>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 12px 0",
                }}
              >
                DESKTOP WALLPAPER
              </h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {WALLPAPERS.map((wp) => {
                  const active = settings.wallpaper === wp.value;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => handleWallpaperChange(wp.value)}
                      style={{
                        flex: "1 1 140px",
                        padding: "24px 12px",
                        borderRadius: "var(--radius-card)",
                        border: active
                          ? "2px solid var(--color-accent)"
                          : "1px solid var(--color-border)",
                        background: wp.value,
                        color: "#ffffff",
                        cursor: "pointer",
                        fontWeight: 600,
                        textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                        textAlign: "center",
                        fontSize: 12,
                        boxShadow: active ? "0 4px 12px rgba(16, 185, 129, 0.25)" : "none",
                        transition:
                          "border-color var(--duration-fast), transform var(--duration-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      {wp.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-text-label)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 12px 0",
                }}
              >
                ACCENT COLOR
              </h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {ACCENT_COLORS.map((ac) => {
                  const active = settings.accentColor === ac.color;
                  return (
                    <button
                      key={ac.color}
                      onClick={() => updateSettings({ accentColor: ac.color })}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: active ? "3px solid #ffffff" : "2px solid rgba(255,255,255,0.1)",
                        background: ac.color,
                        cursor: "pointer",
                        boxShadow: active ? `0 0 12px ${ac.color}` : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform var(--duration-fast)",
                      }}
                      title={ac.name}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      {active && (
                        <span style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold" }}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case "network":
        return (
          <div>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 10px 0",
              }}
            >
              NETWORK STATUS
            </h2>
            <div
              style={{
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>📶</span>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    Connected to Portfolio Host
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      margin: "2px 0 0 0",
                    }}
                  >
                    IPv4 Address: 127.0.0.1 (Loopback)
                  </p>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 12,
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                }}
              >
                Latency: ~2ms • Protocol: HTTP/2 Secure Web Socket
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 12px 0",
              }}
            >
              SECURITY & LOGON
            </h2>
            <div
              style={{
                background: "var(--color-bg-card)",
                padding: "16px 20px",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    margin: 0,
                  }}
                >
                  Enable Lock Screen
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    margin: "4px 0 0 0",
                  }}
                >
                  Require passcode bypass or click action to access the desktop environment on boot.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleLockscreen}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  background: settings.lockScreenEnabled
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background-color var(--duration-fast)",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#ffffff",
                    position: "absolute",
                    top: 3,
                    left: settings.lockScreenEnabled ? 25 : 3,
                    transition: "left var(--duration-fast) var(--ease-spring)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", overflow: "hidden" }}>
      {/* Sidebar List */}
      <AppSidebar>
        <div style={{ padding: "16px 20px 8px 20px" }}>
          <h1
            style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}
          >
            Settings
          </h1>
        </div>

        <div
          style={{
            padding: "0 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginTop: 12,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--color-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "0 8px 4px 8px",
            }}
          >
            SYSTEM
          </span>
          {[
            { id: "general", label: "General", icon: "⚙️" },
            { id: "appearance", label: "Appearance", icon: "🎨" },
            { id: "network", label: "Network", icon: "📶" },
            { id: "security", label: "Security & Logon", icon: "🔒" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  height: 36,
                  padding: "0 12px",
                  borderRadius: 6,
                  border: "none",
                  background: active ? "var(--color-bg-sidebar-active)" : "transparent",
                  color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "background var(--duration-fast), color var(--duration-fast)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </AppSidebar>

      {/* Detail Panel */}
      <AppContentArea style={{ padding: "24px 28px" }}>{renderContent()}</AppContentArea>
    </div>
  );
}
