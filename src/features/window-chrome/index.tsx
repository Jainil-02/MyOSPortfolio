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
  const [size, setSize] = useState(defaultSize ?? { width: 640, height: 480 });
  const [animState, setAnimState] = useState<"opening" | "idle" | "closing" | "minimizing">(
    minimized ? "idle" : "opening",
  );
  const dragRef = useRef<{ active: boolean; offsetX: number; offsetY: number }>({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });
  const resizeRef = useRef<{
    active: boolean;
    direction: "r" | "b" | "br" | null;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
  }>({
    active: false,
    direction: null,
    startWidth: 0,
    startHeight: 0,
    startX: 0,
    startY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const animId = requestAnimationFrame(() => setAnimState("idle"));
    return () => cancelAnimationFrame(animId);
  }, []);

  const [prevDefaultSize, setPrevDefaultSize] = useState(defaultSize);
  const hasSizeChanged =
    defaultSize?.width !== prevDefaultSize?.width ||
    defaultSize?.height !== prevDefaultSize?.height;

  if (hasSizeChanged) {
    setPrevDefaultSize(defaultSize);
    if (defaultSize) {
      setSize(defaultSize);
    }
  }

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

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: "r" | "b" | "br") => {
      e.stopPropagation();
      e.preventDefault();
      if (maximized) return;
      setIsResizing(true);
      resizeRef.current = {
        active: true,
        direction,
        startWidth: size.width,
        startHeight: size.height,
        startX: e.clientX,
        startY: e.clientY,
      };
    },
    [size, maximized],
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

  useEffect(() => {
    if (!isResizing) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current.active) return;
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;

      const newWidth = Math.max(
        320,
        resizeRef.current.startWidth + (resizeRef.current.direction === "b" ? 0 : dx),
      );
      const newHeight = Math.max(
        240,
        resizeRef.current.startHeight + (resizeRef.current.direction === "r" ? 0 : dy),
      );

      setSize({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleGlobalMouseUp = () => {
      resizeRef.current.active = false;
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isResizing]);

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
        width: maximized ? "100%" : size.width,
        height: maximized ? "100%" : size.height,
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
          ...(isResizing ? [] : ["width 0.25s ease", "height 0.25s ease"]),
          "border-radius 0.25s ease",
          "box-shadow 0.2s ease",
          "border-color 0.2s ease",
        ].join(", "),
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          height: 36,
          padding: "0 12px",
          background: focused ? "rgba(15, 23, 42, 0.6)" : "rgba(15, 23, 42, 0.3)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          flexShrink: 0,
        }}
      >
        {/* Left: Window Control Traffic Lights */}
        <div style={{ display: "flex", gap: 6, width: 50, flexShrink: 0 }}>
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
        </div>

        {/* Center: App Icon + Centered Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            padding: "0 8px",
          }}
        >
          <img
            src={icon ?? "/icons/app-default.svg"}
            alt=""
            width={16}
            height={16}
            style={{ borderRadius: 4, marginRight: 6, pointerEvents: "none", flexShrink: 0 }}
          />
          <span
            style={{
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
        </div>

        {/* Right: Overflow Menu Button or Spacer to Balance Layout */}
        <div style={{ width: 50, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: 14,
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
          >
            ⋯
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", color: "#f1f5f9", fontSize: 14 }}>{children}</div>

      {/* Resize Handles (Only when not maximized) */}
      {!maximized && (
        <>
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "r")}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 6,
              height: "100%",
              cursor: "col-resize",
              zIndex: 100,
            }}
          />
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "b")}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 6,
              cursor: "row-resize",
              zIndex: 100,
            }}
          />
          {/* Bottom Right Corner */}
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "br")}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              cursor: "nwse-resize",
              zIndex: 101,
            }}
          />
        </>
      )}
    </div>
  );
}
