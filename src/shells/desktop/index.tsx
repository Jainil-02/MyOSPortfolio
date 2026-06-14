"use client";

import { type ReactElement, useSyncExternalStore, useMemo } from "react";
import { useRouter } from "next/navigation";
import { listApps } from "../../features/app-registry";
import {
  getOsRuntimeState,
  setActiveApp,
  subscribeToOsRuntime,
} from "@core/os-runtime";
import {
  focusWindow,
  listWindows,
  openWindow,
  subscribeToWindows,
} from "@core/window-manager";

const defaultRuntimeState = { booted: true, activeAppId: undefined } as const;
const defaultWindows: readonly never[] = [];

export default function DesktopShell({ children }: { children: React.ReactNode }): ReactElement {
  const router = useRouter();
  const apps = listApps();
  
  const runtimeSnapshot = useMemo(() => defaultRuntimeState, []);
  const windowsSnapshot = useMemo(() => defaultWindows, []);
  
  const runtimeState = useSyncExternalStore(
    subscribeToOsRuntime,
    getOsRuntimeState,
    () => runtimeSnapshot
  );
  const windows = useSyncExternalStore(
    subscribeToWindows,
    listWindows,
    () => windowsSnapshot
  );

  function handleLaunchApp(app: { id: string; title: string; entry?: string }) {
    const existingWindow = windows.find((window) => window.appId === app.id);

    setActiveApp(app.id);

    if (existingWindow) {
      focusWindow(existingWindow.id);
    } else {
      openWindow({
        id: `${app.id}-window`,
        title: app.title,
        appId: app.id,
        focused: true,
        minimized: false,
        maximized: false,
      });
    }

    router.push((app.entry ?? "/") as any);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          padding: 24,
          background: "#f8fafc",
          borderRight: "1px solid #e5e7eb",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Desktop Shell</h2>
        <p style={{ marginBottom: 20, color: "#6b7280" }}>
          This shell lists registered apps and provides the primary desktop launcher.
        </p>
        <div style={{ marginBottom: 20, color: "#0f172a" }}>
          Active app: <strong>{runtimeState.activeAppId ?? "None"}</strong>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {apps.map((app) => {
            const isActive = runtimeState.activeAppId === app.id;

            return (
              <li
                key={app.id}
                style={{
                  padding: "12px 14px",
                  border: `1px solid ${isActive ? "#0f172a" : "#e5e7eb"}`,
                  borderRadius: 14,
                  background: isActive ? "#eef2ff" : "#ffffff",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleLaunchApp(app)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "inherit",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <img
                    src={app.icon ?? "/icons/app-default.svg"}
                    alt=""
                    width={32}
                    height={32}
                    style={{ borderRadius: 8 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{app.title}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{app.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {windows.length > 0 ? (
          <section style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 10, fontSize: 14, fontWeight: 700 }}>Open windows</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {windows.map((window) => (
                <li
                  key={window.id}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    background: window.focused ? "#eef2ff" : "#ffffff",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{window.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{window.appId}</div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
      <main style={{ minHeight: "100vh", background: "#f1f5f9" }}>{children}</main>
    </div>
  );
}
