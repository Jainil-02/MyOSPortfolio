"use client";

import {
  type ReactElement,
  useSyncExternalStore,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { listApps, type AppMeta } from "../../features/app-registry";
import { setActiveApp } from "@core/os-runtime";
import {
  closeWindow,
  focusWindow,
  listWindows,
  maximizeWindow,
  minimizeWindow,
  openWindow,
  subscribeToWindows,
} from "@core/window-manager";
import {
  getNotifications,
  dismissNotification,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "@core/notifications";
import WindowChrome from "../../features/window-chrome";
import CommandPalette from "../../features/command-palette";

const defaultWindows: readonly never[] = [];

function formatClock(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const mm = minutes.toString().padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}

function TaskbarClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "#f1f5f9",
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
      }}
    >
      {formatClock(now)}
    </span>
  );
}

type ContextMenuState = { x: number; y: number } | null;

function DesktopContextMenu({ state, onClose }: { state: ContextMenuState; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [state, onClose]);

  if (!state) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: state.x,
        top: state.y,
        background: "rgba(30, 41, 59, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "4px 0",
        minWidth: 160,
        zIndex: 10000,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {["Refresh", "Paste", "Display Settings"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 16px",
            border: "none",
            background: "transparent",
            color: "#f1f5f9",
            fontSize: 13,
            textAlign: "left",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function NotificationTray() {
  const [open, setOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  const notifications = useSyncExternalStore(subscribeToNotifications, getNotifications, () => []);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={trayRef} style={{ position: "relative" }}>
      <button
        type="button"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          width: 32,
          height: 32,
          border: "none",
          borderRadius: 8,
          background: open ? "rgba(255,255,255,0.12)" : "transparent",
          color: "#f1f5f9",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = open ? "rgba(255,255,255,0.12)" : "transparent";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#ef4444",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 0,
            width: 320,
            maxHeight: 360,
            background: "rgba(15, 23, 42, 0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllAsRead();
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#60a5fa",
                  fontSize: 11,
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 4 }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "24px 12px",
                  textAlign: "center",
                  color: "rgba(241,245,249,0.4)",
                  fontSize: 13,
                }}
              >
                No notifications
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: n.read ? "transparent" : "rgba(96, 165, 250, 0.08)",
                    cursor: "pointer",
                    marginBottom: 2,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = n.read
                      ? "transparent"
                      : "rgba(96, 165, 250, 0.08)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                      {n.type === "error"
                        ? "❌"
                        : n.type === "warning"
                          ? "⚠️"
                          : n.type === "success"
                            ? "✅"
                            : "ℹ️"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}
                      >
                        {n.title}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "rgba(241,245,249,0.6)", lineHeight: 1.3 }}
                      >
                        {n.message}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(241,245,249,0.3)", marginTop: 4 }}>
                        {new Date(n.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(n.id);
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "rgba(241,245,249,0.3)",
                        cursor: "pointer",
                        padding: "2px 4px",
                        fontSize: 14,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopIcon({ app, onLaunch }: { app: AppMeta; onLaunch: (app: AppMeta) => void }) {
  const [selected, setSelected] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onLaunch(app);
    } else {
      setSelected(true);
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const deselect = () => setSelected(false);
    document.addEventListener("click", deselect);
    return () => document.removeEventListener("click", deselect);
  }, [selected]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 6px",
        border: "none",
        borderRadius: 8,
        background: selected ? "rgba(255,255,255,0.15)" : "transparent",
        cursor: "pointer",
        color: "#f1f5f9",
        width: 80,
      }}
    >
      <img
        src={app.icon ?? "/icons/app-default.svg"}
        alt={app.title}
        width={48}
        height={48}
        style={{ borderRadius: 10, pointerEvents: "none" }}
      />
      <span
        style={{
          fontSize: 11,
          textAlign: "center",
          lineHeight: 1.2,
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {app.title}
      </span>
    </button>
  );
}

export default function DesktopShell({ children }: { children: React.ReactNode }): ReactElement {
  const router = useRouter();
  const apps = listApps();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const windowsSnapshot = useMemo(() => defaultWindows, []);

  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => windowsSnapshot);

  const handleLaunchApp = useCallback(
    (app: AppMeta) => {
      const existingWindow = windows.find((window) => window.appId === app.id);
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

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onContextMenu={handleDesktopContextMenu}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--wp-bg, #0f172a)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Desktop surface */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Floating window surface */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Desktop icon grid — always visible behind windows */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              padding: 20,
              alignContent: "flex-start",
              zIndex: 1,
            }}
          >
            {apps.map((app) => (
              <DesktopIcon key={app.id} app={app} onLaunch={handleLaunchApp} />
            ))}
          </div>

          {/* Page content when no windows */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {windows.length === 0 ? (
              <div style={{ padding: 24, color: "rgba(241,245,249,0.4)", fontSize: 14 }}>
                {children}
              </div>
            ) : null}
          </div>

          {/* Windows */}
          {windows.map((win, index) => {
            const appMeta = apps.find((a) => a.id === win.appId);
            const AppComponent = appMeta?.component;

            return (
              <WindowChrome
                key={win.id}
                id={win.id}
                title={win.title}
                icon={appMeta?.icon}
                focused={win.focused}
                minimized={win.minimized}
                maximized={win.maximized}
                zIndex={10 + index}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() => maximizeWindow(win.id)}
                defaultPosition={{ x: 60 + index * 30, y: 40 + index * 30 }}
                defaultSize={appMeta?.defaultSize}
              >
                {AppComponent ? (
                  <AppComponent {...win.initialProps} />
                ) : (
                  <div style={{ padding: 24, color: "rgba(241,245,249,0.5)", fontSize: 14 }}>
                    {win.title}
                  </div>
                )}
              </WindowChrome>
            );
          })}
        </div>
      </div>

      {/* Taskbar */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          zIndex: 100,
          gap: 4,
        }}
      >
        {/* Window indicators */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, overflow: "hidden" }}>
          {windows.length === 0 ? (
            <span style={{ fontSize: 12, color: "rgba(241,245,249,0.4)", marginLeft: 8 }}>
              No open windows
            </span>
          ) : (
            windows.map((win) => (
              <button
                key={win.id}
                type="button"
                onClick={() => {
                  if (win.focused) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: win.focused
                    ? "rgba(255,255,255,0.15)"
                    : win.minimized
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                  color: "#f1f5f9",
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: win.minimized ? 0.6 : 1,
                  transition: "background 0.15s, opacity 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = win.focused
                    ? "rgba(255,255,255,0.15)"
                    : win.minimized
                      ? "rgba(255,255,255,0.05)"
                      : "transparent";
                }}
              >
                {win.title}
              </button>
            ))
          )}
        </div>

        {/* Clock and tray */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NotificationTray />
          <TaskbarClock />
        </div>
      </div>

      <DesktopContextMenu state={contextMenu} onClose={() => setContextMenu(null)} />
      {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
    </div>
  );
}
