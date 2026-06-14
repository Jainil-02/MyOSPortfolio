"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { focusWindow } from "@core/window-manager";

type WindowChromeProps = {
  id: string;
  title: string;
  icon?: string | undefined;
  focused: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children?: ReactNode | undefined;
  defaultPosition?: { x: number; y: number } | undefined;
  defaultSize?: { width: number; height: number } | undefined;
};

const ANIM_DURATION = 250;

export default function WindowChrome({
  id,
  title,
  icon,
  focused,
  minimized,
  maximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  children,
  defaultPosition,
  defaultSize,
}: WindowChromeProps) {
  const [pos, setPos] = useState(defaultPosition ?? { x: 60, y: 40 });
  const [animState, setAnimState] = useState<"opening" | "idle" | "closing" | "minimizing">(
    minimized ? "idle" : "opening",
  );
  const dragRef = useRef<{ active: boolean; offsetX: number; offsetY: number }>({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const animId = requestAnimationFrame(() => setAnimState("idle"));
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (maximized) return;
      setIsDragging(true);
      dragRef.current = {
        active: true,
        offsetX: e.clientX - pos.x,
        offsetY: e.clientY - pos.y,
      };
    },
    [pos, maximized],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      setPos({
        x: e.clientX - dragRef.current.offsetX,
        y: e.clientY - dragRef.current.offsetY,
      });
    };

    const handleGlobalMouseUp = () => {
      dragRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleFocus = useCallback(() => {
    if (!focused) focusWindow(id);
  }, [focused, id]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (animatingRef.current) return;
      animatingRef.current = true;
      setAnimState("closing");
      setTimeout(() => onClose(), ANIM_DURATION);
    },
    [onClose],
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (animatingRef.current) return;
      animatingRef.current = true;
      setAnimState("minimizing");
      setTimeout(() => {
        animatingRef.current = false;
        setAnimState("idle");
        onMinimize();
      }, ANIM_DURATION);
    },
    [onMinimize],
  );

  const handleMaximize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMaximize();
    },
    [onMaximize],
  );

  if (minimized && animState !== "minimizing") return null;

  const isClosing = animState === "closing";

  const getTransform = () => {
    if (animState === "opening") return "scale(0.95)";
    if (animState === "closing") return "scale(0.95)";
    if (animState === "minimizing") return "translateY(200px) scale(0.5)";
    return "none";
  };

  const getOpacity = () => {
    if (animState === "opening" || animState === "closing") return 0;
    if (animState === "minimizing") return 0.5;
    return focused ? 1 : 0.85;
  };

  return (
    <div
      onMouseDown={handleFocus}
      style={{
        position: "absolute",
        left: maximized ? 0 : pos.x,
        top: maximized ? 0 : pos.y,
        width: maximized ? "100%" : (defaultSize?.width ?? 640),
        height: maximized ? "100%" : (defaultSize?.height ?? 480),
        maxWidth: maximized ? "100%" : "calc(100% - 40px)",
        maxHeight: maximized ? "100%" : "calc(100% - 40px)",
        display: "flex",
        flexDirection: "column",
        background: "rgba(30, 41, 59, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: maximized ? 0 : 12,
        boxShadow: focused
          ? "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)"
          : "0 4px 16px rgba(0,0,0,0.3)",
        border: `1px solid ${focused ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        opacity: getOpacity(),
        transform: getTransform(),
        zIndex,
        overflow: "hidden",
        pointerEvents: isClosing ? "none" : undefined,
        transition: [
          "opacity 0.25s ease",
          "transform 0.25s ease",
          "width 0.25s ease",
          "height 0.25s ease",
          "border-radius 0.25s ease",
          "box-shadow 0.2s ease",
          "border-color 0.2s ease",
        ].join(", "),
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          height: 36,
          padding: "0 8px 0 12px",
          background: focused ? "rgba(15, 23, 42, 0.6)" : "rgba(15, 23, 42, 0.3)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          flexShrink: 0,
        }}
      >
        <img
          src={icon ?? "/icons/app-default.svg"}
          alt=""
          width={16}
          height={16}
          style={{ borderRadius: 4, marginRight: 8, pointerEvents: "none" }}
        />
        <span
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            color: "#f1f5f9",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>

        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
          <button
            type="button"
            aria-label="Minimize"
            onClick={handleMinimize}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "none",
              background: "#fbbf24",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <button
            type="button"
            aria-label="Maximize"
            onClick={handleMaximize}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "none",
              background: "#34d399",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "none",
              background: "#ef4444",
              cursor: "pointer",
              padding: 0,
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", color: "#f1f5f9", fontSize: 14 }}>{children}</div>
    </div>
  );
}
