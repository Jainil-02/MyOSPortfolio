"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { listApps, type AppMeta } from "../app-registry";
import { setActiveApp } from "@core/os-runtime";
import { openWindow, focusWindow, listWindows } from "@core/window-manager";

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const apps = listApps();

  const filtered =
    query.trim() === ""
      ? apps
      : apps.filter(
          (app) =>
            app.title.toLowerCase().includes(query.toLowerCase()) ||
            (app.description ?? "").toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const launchApp = useCallback(
    (app: AppMeta) => {
      const windows = listWindows();
      const existingWindow = windows.find((w) => w.appId === app.id);
      setActiveApp(app.id);
      if (existingWindow) {
        focusWindow(existingWindow.id);
      } else {
        openWindow({
          id: `${app.id}-window-${Math.random().toString(36).substring(2, 9)}`,
          title: app.title,
          appId: app.id,
          focused: true,
          minimized: false,
          maximized: false,
        });
      }
      if (!app.component && app.entry) {
        router.push(app.entry as Route);
      }
      onClose();
    },
    [router, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[selectedIndex]) {
          launchApp(filtered[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        paddingTop: "15vh",
        background: "rgba(0,0,0,0.6)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 540,
          maxWidth: "calc(100vw - 32px)",
          background: "rgba(15, 23, 42, 0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "60vh",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search apps and actions..."
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              color: "#f1f5f9",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 4 }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                color: "rgba(241,245,249,0.4)",
                fontSize: 13,
              }}
            >
              No results found
            </div>
          ) : (
            filtered.map((app, index) => (
              <button
                key={app.id}
                type="button"
                onClick={() => launchApp(app)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: index === selectedIndex ? "rgba(96, 165, 250, 0.15)" : "transparent",
                  color: "#f1f5f9",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
              >
                <img
                  src={app.icon ?? "/icons/app-default.svg"}
                  alt=""
                  width={32}
                  height={32}
                  style={{ borderRadius: 6, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{app.title}</div>
                  {app.description && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(241,245,249,0.5)",
                        marginTop: 2,
                      }}
                    >
                      {app.description}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 16,
            fontSize: 11,
            color: "rgba(241,245,249,0.35)",
          }}
        >
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
