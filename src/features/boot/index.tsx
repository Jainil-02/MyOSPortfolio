"use client";

import { useEffect, useState, useCallback } from "react";
import { completeBoot } from "@core/os-runtime";

const BOOT_DURATION = 2200;
const FADE_DURATION = 500;

export default function BootScreen() {
  const [phase, setPhase] = useState<"boot" | "fade" | "done">("boot");

  const finish = useCallback(() => {
    setPhase("done");
    completeBoot();
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setPhase("fade");
    }, BOOT_DURATION);

    const doneTimer = setTimeout(finish, BOOT_DURATION + FADE_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [finish]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        color: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
        opacity: phase === "fade" ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#e2e8f0",
          }}
        >
          My OS Portfolio
        </div>

        <div
          style={{
            width: 200,
            height: 2,
            background: "rgba(226, 232, 240, 0.12)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #a5b4fc)",
              borderRadius: 1,
              animation: "my-os-boot-progress 1.8s ease-in-out forwards",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            letterSpacing: "0.08em",
          }}
        >
          Loading system components...
        </div>
      </div>

      <style>{`
        @keyframes my-os-boot-progress {
          0%   { width: 0%; }
          30%  { width: 35%; }
          60%  { width: 65%; }
          85%  { width: 88%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
