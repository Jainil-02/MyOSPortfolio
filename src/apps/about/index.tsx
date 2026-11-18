"use client";

import React from "react";
import { openWindow, focusWindow, listWindows } from "@core/window-manager";
import { setActiveApp } from "@core/os-runtime";
import AppTagBadge from "../../shared/ui/AppTagBadge";

export default function AboutApp() {
  const launchApp = (appId: string, title: string) => {
    const windows = listWindows();
    const existing = windows.find((w) => w.appId === appId);
    setActiveApp(appId);
    if (existing) {
      focusWindow(existing.id);
    } else {
      openWindow({
        id: `${appId}-window-${Math.random().toString(36).substring(2, 9)}`,
        title,
        appId,
        focused: true,
        minimized: false,
        maximized: false,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        background: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          width: 250,
          minWidth: 250,
          borderRight: "1px solid var(--color-border)",
          background: "var(--color-bg-sidebar)",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          overflowY: "auto",
        }}
      >
        {/* Profile Avatar */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-accent) 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            color: "#ffffff",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
            border: "3px solid rgba(255, 255, 255, 0.1)",
            userSelect: "none",
          }}
        >
          JP
        </div>

        {/* User Details */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1
            style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}
          >
            Jainil Pandya
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
            Software Developer
          </p>
          <div style={{ marginTop: 8 }}>
            <AppTagBadge variant="active" style={{ fontSize: 10, height: 20, padding: "0 8px" }}>
              🟢 Open to Roles
            </AppTagBadge>
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "var(--color-border)" }} />

        {/* Info Rows */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ color: "var(--color-text-secondary)" }}>Toronto, ON, Canada</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>✉️</span>
            <span
              style={{
                color: "var(--color-text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              jainil.pandya.dev@gmail.com
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA Buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            type="button"
            onClick={() => launchApp("resume", "Resume")}
            style={{
              width: "100%",
              height: 38,
              borderRadius: "var(--radius-button)",
              background: "var(--color-accent)",
              border: "none",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            View Resume
          </button>
          <button
            type="button"
            onClick={() => launchApp("contact", "Contact")}
            style={{
              width: "100%",
              height: 38,
              borderRadius: "var(--radius-button)",
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background var(--duration-fast), border-color var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface-2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-surface-1)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Bio */}
        <div>
          <h2
            style={{
              fontSize: 11,
              color: "var(--color-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 8px 0",
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            I am a results-driven Software Developer with a strong focus on frontend craft, dynamic
            user interfaces, and modular applications. I specialize in building immersive web
            environments using React, Next.js, and TypeScript, as well as native mobile applications
            with React Native.
          </p>
        </div>

        {/* Current Focus Card */}
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            padding: "16px 20px",
          }}
        >
          <h2
            style={{
              fontSize: 11,
              color: "var(--color-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 10px 0",
            }}
          >
            ⚡ Current Focus
          </h2>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--color-text-primary)",
                }}
              >
                ApexOS Portfolio
              </h3>
              <p
                style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}
              >
                Lead Architect • Web-based Operating System Experience
              </p>
            </div>
            <button
              type="button"
              onClick={() => launchApp("projects", "Projects")}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-accent)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Explore Project →
            </button>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
              marginTop: 8,
              lineHeight: 1.5,
              margin: "8px 0 0 0",
            }}
          >
            Building an interactive, browser-based mock OS dashboard system using Next.js 14 and
            custom React state layers to showcase development portfolio projects.
          </p>
        </div>

        {/* Technologies */}
        <div>
          <h2
            style={{
              fontSize: 11,
              color: "var(--color-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 10px 0",
            }}
          >
            Technologies & Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              "Next.js",
              "React",
              "TypeScript",
              "JavaScript",
              "React Native",
              "Tailwind CSS",
              "Zod",
              "Git",
              "SQL",
            ].map((tech) => (
              <AppTagBadge key={tech} variant="tech">
                {tech}
              </AppTagBadge>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h2
            style={{
              fontSize: 11,
              color: "var(--color-text-label)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 10px 0",
            }}
          >
            Career Highlights
          </h2>
          <ul
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              margin: 0,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <li>
              <strong>Advanced Diploma in Software Development</strong> — Sheridan College (GPA:
              3.8/4.0).
            </li>
            <li>
              <strong>Meta Front-End Developer</strong> Certificate holder.
            </li>
            <li>
              <strong>35% FID Optimization</strong> achieved through visual layout refactoring and
              state caching.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
