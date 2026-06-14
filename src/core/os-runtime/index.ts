/**
 * OS runtime scaffolding.
 *
 * This module defines the core runtime interface for the application shell.
 * It is intentionally minimal in the Foundation Phase and will evolve into
 * a stateful platform for application lifecycle and system-level services.
 */

import { getSettings } from "../settings";

export type OsRuntimeState = {
  booted: boolean;
  locked: boolean;
  activeAppId: string | undefined;
};

const initialRuntimeState: OsRuntimeState = {
  booted: false,
  locked: true,
  activeAppId: undefined,
};

let runtimeState = { ...initialRuntimeState };

type OsRuntimeSubscriber = (state: Readonly<OsRuntimeState>) => void;
const runtimeSubscribers = new Set<OsRuntimeSubscriber>();

function broadcastRuntimeState() {
  for (const subscriber of runtimeSubscribers) {
    subscriber(runtimeState);
  }
}

export function getOsRuntimeState(): Readonly<OsRuntimeState> {
  return runtimeState;
}

export function completeBoot() {
  if (runtimeState.booted) return;
  const settings = getSettings();
  runtimeState = { ...runtimeState, booted: true, locked: settings.lockScreenEnabled };
  broadcastRuntimeState();
}

export function unlock() {
  if (!runtimeState.locked) return;
  runtimeState = { ...runtimeState, locked: false };
  broadcastRuntimeState();
}

export function lock() {
  if (runtimeState.locked) return;
  runtimeState = { ...runtimeState, locked: true };
  broadcastRuntimeState();
}

export function setActiveApp(appId: string) {
  runtimeState = { ...runtimeState, activeAppId: appId };
  broadcastRuntimeState();
}

export function resetOsRuntime() {
  runtimeState = { ...initialRuntimeState };
  broadcastRuntimeState();
}

export function subscribeToOsRuntime(subscriber: OsRuntimeSubscriber) {
  runtimeSubscribers.add(subscriber);
  subscriber(runtimeState);

  return () => {
    runtimeSubscribers.delete(subscriber);
  };
}
