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
        background: "var(--color-bg-base, #0a0f1a)",
        color: "var(--color-text-primary, #f1f5f9)",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        opacity: phase === "fade" ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Animated ApexOS Isometric Cubic Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "apex-cube-float 3s ease-in-out infinite",
          }}
        >
          <svg
            width="64"
            height="72"
            viewBox="0 0 64 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Face */}
            <path
              d="M32 4L58 19L32 34L6 19L32 4Z"
              fill="url(#topGrad)"
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Left Face */}
            <path
              d="M6 19V49L32 64V34L6 19Z"
              fill="url(#leftGrad)"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Right Face */}
            <path
              d="M32 34V64L58 49V19L32 34Z"
              fill="url(#rightGrad)"
              stroke="rgba(16, 185, 129, 0.5)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="topGrad"
                x1="32"
                y1="4"
                x2="32"
                y2="34"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#059669" stop-opacity="0.5" />
              </linearGradient>
              <linearGradient
                id="leftGrad"
                x1="6"
                y1="19"
                x2="32"
                y2="64"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#059669" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#047857" stop-opacity="0.7" />
              </linearGradient>
              <linearGradient
                id="rightGrad"
                x1="58"
                y1="19"
                x2="32"
                y2="64"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#064e3b" stop-opacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Wordmark and Tagline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            ApexOS
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: "rgba(241, 245, 249, 0.4)",
              textTransform: "uppercase",
            }}
          >
            Jainil Pandya
          </div>
        </div>

        {/* Subtle, thin progress loader */}
        <div
          style={{
            width: 160,
            height: 2,
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: 1,
            overflow: "hidden",
            marginTop: 12,
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--color-accent, #10b981)",
              borderRadius: 1,
              animation: "my-os-boot-progress 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "rgba(241, 245, 249, 0.25)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Initializing System
        </div>
      </div>

      <style>{`
        @keyframes my-os-boot-progress {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 60%; }
          80%  { width: 90%; }
          100% { width: 100%; }
        }
        @keyframes apex-cube-float {
          0%, 100% {
            transform: translateY(0);
            filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.15));
          }
          50% {
            transform: translateY(-6px);
            filter: drop-shadow(0 12px 24px rgba(16, 185, 129, 0.3));
          }
        }
      `}</style>
    </div>
  );
}
