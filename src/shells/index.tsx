"use client";

import { useEffect, useMemo, useState } from "react";
import DesktopShell from "./desktop";
import MobileShell from "./mobile";
import TabletShell from "./tablet";

export default function ShellHost({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

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

  return useMemo(() => {
    if (mode === "mobile") {
      return <MobileShell>{children}</MobileShell>;
    }

    if (mode === "tablet") {
      return <TabletShell>{children}</TabletShell>;
    }

    return <DesktopShell>{children}</DesktopShell>;
  }, [children, mode]);
}
