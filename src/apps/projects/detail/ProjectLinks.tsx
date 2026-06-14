import React from "react";
import { openWindow } from "@core/window-manager";

type ProjectLinksProps = {
  githubUrl?: string | undefined;
  liveUrl?: string | undefined;
};

export default function ProjectLinks({ githubUrl, liveUrl }: ProjectLinksProps) {
  const handleOpenLink = (url: string, title: string) => {
    openWindow({
      id: `browser-${Date.now()}`,
      title: `${title} - Browser`,
      appId: "browser",
      focused: true,
      minimized: false,
      maximized: false,
      initialProps: { url },
    });
  };

  if (!githubUrl && !liveUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginTop: 24,
        paddingTop: 16,
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {githubUrl && (
        <button
          onClick={() => handleOpenLink(githubUrl, "GitHub")}
          style={{
            flex: 1,
            height: 36,
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 8,
            color: "var(--color-text-primary)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          }}
        >
          <span>📁</span> GitHub Repository
        </button>
      )}

      {liveUrl && (
        <button
          onClick={() => handleOpenLink(liveUrl, "Live Demo")}
          style={{
            flex: 1,
            height: 36,
            background: "var(--color-accent)",
            border: "none",
            borderRadius: 8,
            color: "var(--color-text-inverse)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-accent)";
          }}
        >
          <span>🌐</span> Live Demo
        </button>
      )}
    </div>
  );
}
