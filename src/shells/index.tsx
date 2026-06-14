"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getOsRuntimeState, subscribeToOsRuntime } from "@core/os-runtime";
import DesktopShell from "./desktop";
import MobileShell from "./mobile";
import TabletShell from "./tablet";
import BootScreen from "../features/boot";
import LockScreen from "../features/lock-screen";

const defaultRuntimeState = {
  booted: false,
  locked: true,
  activeAppId: undefined,
} as const;

export default function ShellHost({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const runtimeState = useSyncExternalStore(
    subscribeToOsRuntime,
    getOsRuntimeState,
    () => defaultRuntimeState,
  );

  useEffect(() => {
    const updateMode = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setMode("mobile");
      } else if (width < 1200) {
        setMode("tablet");
      } else {
        setMode("desktop");
      }
    };

    updateMode();
    window.addEventListener("resize", updateMode);

    return () => window.removeEventListener("resize", updateMode);
  }, []);

  const shell = useMemo(() => {
    if (mode === "mobile") {
      return <MobileShell>{children}</MobileShell>;
    }

    if (mode === "tablet") {
      return <TabletShell>{children}</TabletShell>;
    }

    return <DesktopShell>{children}</DesktopShell>;
  }, [children, mode]);

  if (!runtimeState.booted) {
    return <BootScreen />;
  }

  if (runtimeState.locked) {
    return <LockScreen />;
  }

  return shell;
}
