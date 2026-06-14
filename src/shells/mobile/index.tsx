"use client";

import { type ReactElement, useSyncExternalStore, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Route } from "next";
import { listApps, type AppMeta } from "../../features/app-registry";
import { getOsRuntimeState, setActiveApp, subscribeToOsRuntime } from "@core/os-runtime";
import { focusWindow, listWindows, openWindow, subscribeToWindows } from "@core/window-manager";

const defaultRuntimeState = { booted: true, locked: false, activeAppId: undefined } as const;
const defaultWindows: readonly never[] = [];

export default function MobileShell({ children }: { children: React.ReactNode }): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const apps = listApps();

  const runtimeSnapshot = useMemo(() => defaultRuntimeState, []);
  const windowsSnapshot = useMemo(() => defaultWindows, []);

  const runtimeState = useSyncExternalStore(
    subscribeToOsRuntime,
    getOsRuntimeState,
    () => runtimeSnapshot,
  );
  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => windowsSnapshot);

  const activeApp = runtimeState.activeAppId
    ? apps.find((a) => a.id === runtimeState.activeAppId)
    : undefined;

  const isRootPath =
    !runtimeState.activeAppId && (pathname === "/" || pathname === "/apps/projects");

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
    [router, windows],
  );

  const handleBack = useCallback(() => {
    if (runtimeState.activeAppId) {
      setActiveApp("");
    } else {
      router.back();
    }
  }, [router, runtimeState.activeAppId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        background: "var(--wp-bg, #0f172a)",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.08)",
          minHeight: 52,
        }}
      >
        {!isRootPath ? (
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "none",
              borderRadius: 10,
              background: "rgba(226, 232, 240, 0.08)",
              color: "#e2e8f0",
              fontSize: 18,
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
            aria-label="Go back"
          >
            &#8592;
          </button>
        ) : null}
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f1f5f9",
          }}
        >
          {activeApp?.title ?? "My OS Portfolio"}
        </span>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "transparent",
        }}
      >
        {activeApp?.component ? <activeApp.component /> : children}
      </main>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 12px",
          paddingBottom: "max(8px, env(safe-area-inset-bottom, 8px))",
          background: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(226, 232, 240, 0.08)",
          minHeight: 64,
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
                gap: 2,
                padding: "6px 12px",
                minWidth: 56,
                border: "none",
                borderRadius: 12,
                background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                color: isActive ? "#ffffff" : "#64748b",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <img
                src={app.icon ?? "/icons/app-default.svg"}
                alt=""
                width={28}
                height={28}
                style={{ borderRadius: 7, pointerEvents: "none" }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#a5b4fc" : "#64748b",
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
              gap: 2,
              paddingLeft: 8,
              marginLeft: 8,
              borderLeft: "1px solid rgba(226, 232, 240, 0.12)",
            }}
          >
            {windows.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => focusWindow(w.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: w.focused ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  color: w.focused ? "#a5b4fc" : "#64748b",
                  fontSize: 11,
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
