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

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        lineHeight: 1.15,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#f1f5f9",
          whiteSpace: "nowrap",
        }}
      >
        {formatClock(now)}
      </span>
      <span
        style={{
          fontSize: 10,
          color: "rgba(255, 255, 255, 0.45)",
          whiteSpace: "nowrap",
        }}
      >
        {formatDate(now)}
      </span>
    </div>
  );
}

type ContextMenuState = { x: number; y: number } | null;

type DesktopContextMenuProps = {
  state: ContextMenuState;
  onClose: () => void;
  onRefresh: () => void;
  onDisplaySettings: () => void;
};

function DesktopContextMenu({
  state,
  onClose,
  onRefresh,
  onDisplaySettings,
}: DesktopContextMenuProps) {
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

  const handleItemClick = (item: string) => {
    onClose();
    if (item === "Refresh") {
      onRefresh();
    } else if (item === "Display Settings") {
      onDisplaySettings();
    }
  };

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
          onClick={() => handleItemClick(item)}
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
        setSelected(true);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onLaunch(app);
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

  const handleTaskbarClick = useCallback(
    (app: AppMeta) => {
      const existingWindow = windows.find((w) => w.appId === app.id);
      if (existingWindow) {
        if (existingWindow.focused && !existingWindow.minimized) {
          minimizeWindow(existingWindow.id);
        } else {
          focusWindow(existingWindow.id);
        }
      } else {
        handleLaunchApp(app);
      }
    },
    [windows, handleLaunchApp],
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
              left: 20,
              top: 20,
              bottom: 72,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: 12,
              alignContent: "flex-start",
              zIndex: 2,
            }}
          >
            {apps.map((app) => (
              <DesktopIcon key={app.id} app={app} onLaunch={handleLaunchApp} />
            ))}
          </div>

          {/* Page content when no windows */}
          <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
            {windows.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  color: "rgba(241,245,249,0.4)",
                  fontSize: 14,
                  pointerEvents: "auto",
                }}
              >
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
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          zIndex: 1000,
        }}
      >
        {/* Left Section: Grid Toggle + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Grid/Apps Toggle Button */}
          <button
            type="button"
            aria-label="Start Menu"
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "background var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            ⊞
          </button>
          {/* Search Icon Button */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "background var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center Section: Pinned & Running Apps */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {apps
            .filter((app) => app.pinned || windows.some((w) => w.appId === app.id))
            .map((app) => {
              const win = windows.find((w) => w.appId === app.id);
              const isOpen = !!win;
              const isFocused = win ? win.focused && !win.minimized : false;

              return (
                <button
                  key={app.id}
                  type="button"
                  aria-label={app.title}
                  onClick={() => handleTaskbarClick(app)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: "none",
                    background: isFocused ? "rgba(255,255,255,0.12)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "background var(--duration-fast), transform var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isFocused
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isFocused
                      ? "rgba(255,255,255,0.12)"
                      : "transparent";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <img
                    src={app.icon ?? "/icons/app-default.svg"}
                    alt={app.title}
                    width={24}
                    height={24}
                    style={{
                      borderRadius: 5,
                      pointerEvents: "none",
                      opacity: win?.minimized ? 0.6 : 1,
                    }}
                  />
                  {isOpen && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 3,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                      }}
                    />
                  )}
                </button>
              );
            })}
        </div>

        {/* Right Section: System Tray & Clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* System status items (WiFi & Battery placeholders) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {/* WiFi */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="WiFi status connected"
            >
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            {/* Battery */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Battery status charging"
            >
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
              <line x1="23" y1="11" x2="23" y2="13" />
            </svg>
          </div>
          <NotificationTray />
          <TaskbarClock />
        </div>
      </div>

      <DesktopContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(null)}
        onRefresh={() => window.location.reload()}
        onDisplaySettings={() => {
          const settings = apps.find((a) => a.id === "settings");
          if (settings) handleLaunchApp(settings);
        }}
      />
      {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
    </div>
  );
}
