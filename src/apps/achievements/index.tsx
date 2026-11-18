"use client";

import React, { useState, useMemo } from "react";
import { getAchievements, Achievement } from "@data/achievements";
import AppTagBadge from "@/shared/ui/AppTagBadge";

const CATEGORY_LABELS: Record<Achievement["category"], string> = {
  project: "Project",
  certification: "Certification",
  contribution: "Contribution",
  recognition: "Recognition",
};

const CATEGORY_ICONS: Record<Achievement["category"], string> = {
  project: "📁",
  certification: "📜",
  contribution: "🌍",
  recognition: "🏆",
};

export default function AchievementsApp() {
  const [selectedCategory, setSelectedCategory] = useState<Achievement["category"] | "all">("all");

  const achievements = useMemo(() => getAchievements(), []);
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === "all") return achievements;
    return achievements.filter((a) => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const categories: (Achievement["category"] | "all")[] = [
    "all",
    "project",
    "certification",
    "contribution",
    "recognition",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .achievements-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 20px;
          overflow: hidden;
        }
        .achievements-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-border);
        }
        .achievements-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
        }
        .achievements-count {
          font-size: 12px;
          color: var(--color-text-muted);
        }
        .category-filter {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .category-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-secondary);
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .category-filter-btn:hover {
          background: var(--color-surface-1);
          border-color: var(--color-border-focus);
          color: var(--color-text-primary);
        }
        .category-filter-btn.active {
          background: color-mix(in srgb, var(--color-accent) 15%, transparent);
          border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
          color: var(--color-accent);
        }
        .achievements-grid {
          flex: 1;
          overflow-y: auto;
          padding: 4px 4px 4px 0;
        }
        .achievements-grid-inner {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .achievement-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .achievement-card:hover {
          border-color: var(--color-border-focus);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .achievement-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .achievement-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-surface-1);
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }
        .achievement-title-block {
          flex: 1;
          min-width: 0;
        }
        .achievement-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        .achievement-category-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .achievement-category-icon {
          font-size: 10px;
        }
        .achievement-description {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        .achievement-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid var(--color-border);
        }
        .achievement-date {
          font-size: 12px;
          color: var(--color-text-muted);
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-text-secondary);
          padding: 24px;
          text-align: center;
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }
        .empty-hint {
          font-size: 12px;
          line-height: 1.6;
        }

        /* Responsive grid */
        @media (max-width: 1000px) {
          .achievements-grid-inner {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 700px) {
          .achievements-grid-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="achievements-container">
        {/* Header */}
        <div className="achievements-header">
          <div className="achievements-title">Achievements</div>
          <div className="achievements-count">
            {filteredAchievements.length} of {achievements.length} achievements
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat !== "all" && <span className="achievement-category-icon">{CATEGORY_ICONS[cat]}</span>}
              <span>{cat === "all" ? "All" : CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="achievements-grid">
          {filteredAchievements.length > 0 ? (
            <div className="achievements-grid-inner">
              {filteredAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-header">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-title-block">
                      <h3 className="achievement-title">{achievement.title}</h3>
                      <div className="achievement-category-row">
                        <AppTagBadge variant="neutral" style={{ fontSize: 10, padding: "2px 8px", height: 20 }}>
                          {CATEGORY_ICONS[achievement.category]} {CATEGORY_LABELS[achievement.category]}
                        </AppTagBadge>
                      </div>
                    </div>
                  </div>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-footer">
                    <span className="achievement-date">
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <div className="empty-title">No achievements in this category</div>
              <div className="empty-hint">Select a different filter or add achievements to <code>src/data/achievements.ts</code></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}