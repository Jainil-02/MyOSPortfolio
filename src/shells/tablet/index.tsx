"use client";

import { type ReactElement, useSyncExternalStore, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { listApps, type AppMeta } from "../../features/app-registry";
import { getOsRuntimeState, setActiveApp, subscribeToOsRuntime } from "@core/os-runtime";
import { focusWindow, listWindows, openWindow, subscribeToWindows } from "@core/window-manager";

const defaultRuntimeState = { booted: true, locked: false, activeAppId: undefined } as const;
const defaultWindows: readonly never[] = [];

export default function TabletShell({ children }: { children: React.ReactNode }): ReactElement {
  const router = useRouter();
  const apps = listApps();

  const runtimeSnapshot = useMemo(() => defaultRuntimeState, []);
  const windowsSnapshot = useMemo(() => defaultWindows, []);

  const runtimeState = useSyncExternalStore(
    subscribeToOsRuntime,
    getOsRuntimeState,
    () => runtimeSnapshot,
  );
  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => windowsSnapshot);

  const handleLaunchApp = useCallback(
    (app: AppMeta) => {
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
    },
    [windows, router],
  );

  const activeApp = runtimeState.activeAppId
    ? apps.find((a) => a.id === runtimeState.activeAppId)
    : undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        background: "var(--wp-bg, #0f172a)",
        color: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <main
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {activeApp?.component ? <activeApp.component /> : children}
      </main>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 20px",
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          minHeight: 72,
        }}
      >
        {apps.map((app) => {
          const isActive = runtimeState.activeAppId === app.id;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => handleLaunchApp(app)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 16px",
                minWidth: 72,
                border: "none",
                borderRadius: 16,
                background: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                color: isActive ? "#ffffff" : "rgba(241, 245, 249, 0.6)",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <img
                src={app.icon ?? "/icons/app-default.svg"}
                alt=""
                width={36}
                height={36}
                style={{ borderRadius: 10, pointerEvents: "none" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ffffff" : "rgba(241, 245, 249, 0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {app.title}
              </span>
            </button>
          );
        })}

        {windows.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              paddingLeft: 12,
              marginLeft: 12,
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {windows.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => focusWindow(w.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: w.focused ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  color: w.focused ? "#ffffff" : "rgba(241, 245, 249, 0.6)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {w.title}
              </button>
            ))}
          </div>
        ) : null}
      </nav>
    </div>
  );
}
