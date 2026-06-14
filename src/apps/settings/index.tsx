"use client";

import React, { useSyncExternalStore } from "react";
import { getSettings, updateSettings, subscribeToSettings } from "@core/settings";

const WALLPAPERS = [
  {
    id: "dark-blue",
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

export default function SettingsApp() {
  const settings = useSyncExternalStore(subscribeToSettings, getSettings, () => ({
    wallpaper: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    wallpaperVariant: "dark" as const,
    theme: "dark" as const,
    lockScreenEnabled: true,
  }));

  const handleWallpaperChange = (val: string) => {
    updateSettings({ wallpaper: val });
  };

  const handleToggleLockscreen = () => {
    updateSettings({ lockScreenEnabled: !settings.lockScreenEnabled });
  };

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#f1f5f9" }}>
        System Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Wallpaper customization */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#cbd5e1", marginBottom: 8 }}>
            Desktop Wallpaper
          </h3>
          <div style={{ display: "flex", gap: 12 }}>
            {WALLPAPERS.map((wp) => {
              const active = settings.wallpaper === wp.value;
              return (
                <button
                  key={wp.id}
                  onClick={() => handleWallpaperChange(wp.value)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    borderRadius: 8,
                    border: active ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: wp.value,
                    color: "#f1f5f9",
                    cursor: "pointer",
                    fontWeight: 500,
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    textAlign: "center",
                    fontSize: 12,
                  }}
                >
                  {wp.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lock Screen Settings */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: 16,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>
                Enable Lock Screen
              </h4>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0 0" }}>
                Require unlocking after booting the system
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.lockScreenEnabled}
              onChange={handleToggleLockscreen}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
