import React from "react";

export default function ProjectEmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 32,
          marginBottom: 16,
          opacity: 0.5,
          userSelect: "none",
        }}
      >
        📁
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: 4,
        }}
      >
        Select a Project
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--color-text-secondary)",
          maxWidth: 240,
          lineHeight: 1.4,
        }}
      >
        Select a project from the list to view its details, tech stack, and interactive reel.
      </div>
    </div>
  );
}
