/**
 * Window manager scaffolding.
 *
 * This module defines the minimal window lifecycle contract for the OS shell.
 * Later work will add floating windows, focus state, and taskbar mapping.
 */

export type WindowState = {
  id: string;
  title: string;
  appId: string;
  focused: boolean;
  minimized: boolean;
  maximized: boolean;
};

const initialWindows: WindowState[] = [];

let windows: WindowState[] = [...initialWindows];

type WindowManagerSubscriber = (windows: ReadonlyArray<WindowState>) => void;
const windowManagerSubscribers = new Set<WindowManagerSubscriber>();

function broadcastWindowState() {
  for (const subscriber of windowManagerSubscribers) {
    subscriber(windows);
  }
}

export function listWindows(): ReadonlyArray<WindowState> {
  return windows;
}

export function openWindow(window: WindowState) {
  windows = windows.map((existing) => ({ ...existing, focused: false }));
  windows.push({ ...window, focused: true });
  broadcastWindowState();
}

export function closeWindow(id: string) {
  windows = windows.filter((window) => window.id !== id);
  broadcastWindowState();
}

export function focusWindow(id: string) {
  windows = windows.map((window) => ({
    ...window,
    focused: window.id === id,
  }));
  broadcastWindowState();
}

export function resetWindows() {
  windows = [...initialWindows];
  broadcastWindowState();
}

export function subscribeToWindows(subscriber: WindowManagerSubscriber) {
  windowManagerSubscribers.add(subscriber);
  subscriber(windows);

  return () => {
    windowManagerSubscribers.delete(subscriber);
  };
}
