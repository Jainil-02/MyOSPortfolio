"use client";

import React from "react";

export default function AboutApp() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#f1f5f9" }}>
        About MyOS
      </h2>
      <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 16 }}>
        Welcome to MyOS, a browser-based, personal operating system portfolio built with Next.js,
        React, and TypeScript.
      </p>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          padding: 12,
          borderRadius: 8,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>
          Developer Info
        </h3>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0" }}>
          <strong>Name:</strong> Jainil Pandya
        </p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0" }}>
          <strong>OS Version:</strong> v1.0.0-beta
        </p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0" }}>
          <strong>Environment:</strong> Next.js App Router
        </p>
      </div>
    </div>
  );
}
