/**
 * OS runtime scaffolding.
 *
 * This module defines the core runtime interface for the application shell.
 * It is intentionally minimal in the Foundation Phase and will evolve into
 * a stateful platform for application lifecycle and system-level services.
 */

export type OsRuntimeState = {
  booted: boolean;
  activeAppId: string | undefined;
};

const initialRuntimeState: OsRuntimeState = {
  booted: true,
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
