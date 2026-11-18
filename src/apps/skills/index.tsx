"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { getSkillCategories } from "@data/skills";
import { subscribeToWindows, listWindows } from "@core/window-manager";
import AppSidebar from "@shared/ui/AppSidebar";
import AppContentArea from "@shared/ui/AppContentArea";
import AppTagBadge from "@shared/ui/AppTagBadge";

export default function SkillsApp() {
  const categories = useMemo(() => getSkillCategories(), []);

  // Active Category State
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || "frontend");

  // Window Focus Subscriptions
  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => []);
  const isFocused = useMemo(() => {
    const win = windows.find((w) => w.appId === "skills");
    return win ? win.focused && !win.minimized : false;
  }, [windows]);

  // Selected Category Resolution
  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [activeCategoryId, categories]);

  // Keyboard navigation for sidebar categories
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        return;
      }

      const currentIndex = categories.findIndex((c) => c.id === activeCategoryId);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex < categories.length - 1) {
          const nextCat = categories[currentIndex + 1];
          if (nextCat) {
            setActiveCategoryId(nextCat.id);
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          const prevCat = categories[currentIndex - 1];
          if (prevCat) {
            setActiveCategoryId(prevCat.id);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, categories, activeCategoryId]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar Section */}
      <AppSidebar style={{ padding: 12, gap: 12 }}>
        {/* Section Header */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-label)",
            paddingLeft: 4,
            marginTop: 8,
          }}
        >
          Categories
        </div>

        {/* Sidebar Item List */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <SidebarItem
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                isActive={isActive}
                onClick={() => setActiveCategoryId(cat.id)}
              />
            );
          })}
        </div>
      </AppSidebar>

      {/* Content Area Section */}
      <AppContentArea style={{ display: "flex", flexDirection: "column", padding: "20px 24px" }}>
        {selectedCategory ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Content Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }} role="img" aria-label={selectedCategory.label}>
                {selectedCategory.icon}
              </span>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                {selectedCategory.label}
              </h2>
            </div>

            {/* Separator */}
            <div style={{ borderBottom: "1px solid var(--color-border)" }} />

            {/* Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {selectedCategory.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--color-text-muted)",
              fontSize: 13,
            }}
          >
            No category selected.
          </div>
        )}
      </AppContentArea>
    </div>
  );
}

type SidebarItemProps = {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
};

function SidebarItem({ label, icon, isActive, onClick }: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        height: 40,
        padding: "0 12px",
        borderRadius: 6,
        border: isActive ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
        background: isActive
          ? "var(--color-bg-sidebar-active)"
          : isHovered
            ? "var(--color-surface-1)"
            : "transparent",
        textAlign: "left",
        cursor: "pointer",
        transition: "all var(--duration-fast) var(--ease-spring)",
        color: isActive ? "#ffffff" : "var(--color-text-primary)",
        fontSize: 13,
        fontWeight: 500,
        outline: "none",
        transform: isHovered && !isActive ? "translateX(2px)" : "none",
      }}
    >
      <span style={{ fontSize: 16 }} role="img" aria-label={label}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

type SkillCardProps = {
  skill: {
    name: string;
    level: "expert" | "proficient" | "learning";
    yearsOfExperience?: number;
    highlights?: string;
  };
};

function SkillCard({ skill }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "expert":
        return "Expert";
      case "proficient":
        return "Proficient";
      case "learning":
        return "Learning";
      default:
        return level;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "var(--color-bg-card)",
        border: isHovered ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid var(--color-border)",
        borderRadius: "var(--radius-card, 12px)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "all var(--duration-fast) var(--ease-spring)",
        transform: isHovered ? "translateY(-2px)" : "none",
        boxShadow: isHovered ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none",
      }}
    >
      {/* Name and Tag row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {skill.name}
        </span>
        <AppTagBadge variant={skill.level === "expert" ? "active" : "neutral"}>
          {getLevelLabel(skill.level)}
        </AppTagBadge>
      </div>

      {/* Years of Experience */}
      {skill.yearsOfExperience !== undefined && (
        <div
          style={{
            fontSize: 12,
            color: "var(--color-text-muted)",
          }}
        >
          {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"} experience
        </div>
      )}

      {/* Highlights */}
      {skill.highlights && (
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: 13,
            color: "var(--color-text-secondary)",
            lineHeight: "1.5",
          }}
        >
          {skill.highlights}
        </p>
      )}
    </div>
  );
}
