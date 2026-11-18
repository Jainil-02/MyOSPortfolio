import React, { useState } from "react";
import { Project } from "@shared/schemas/project.schema";
import ProjectHeader from "./ProjectHeader";
import ProjectDescription from "./ProjectDescription";
import ProjectTechStack from "./ProjectTechStack";
import ProjectLinks from "./ProjectLinks";
import AppContentArea from "@shared/ui/AppContentArea";

type DetailTab = "overview" | "reel" | "story";

type ProjectDetailProps = {
  project: Project;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  renderReelViewer: () => React.ReactNode;
};

export default function ProjectDetail({
  project,
  activeTab,
  onTabChange,
  renderReelViewer,
}: ProjectDetailProps) {
  const [coverError, setCoverError] = useState(false);

  // Dynamic tab configuration as required by § 15
  const tabConfig: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "reel", label: "Reel ▶" },
  ];

  return (
    <AppContentArea style={{ display: "flex", flexDirection: "column" }}>
      {/* Cover Image */}
      <div
        style={{
          width: "100%",
          height: 180,
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {project.coverImage && !coverError ? (
          <img
            src={project.coverImage}
            alt={project.title}
            onError={() => setCoverError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.15)",
              fontSize: 48,
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {project.title.substring(0, 2).toUpperCase()}
          </div>
        )}
        {/* Premium Overlay & Bottom Blend Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10, 15, 26, 0.1) 0%, rgba(10, 15, 26, 0.3) 65%, var(--color-bg-surface) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Tab Row (styled based on DESIGN_SYSTEM.md § 9.2 / 6 Navigation) */}
      <div
        style={{
          display: "flex",
          height: 40,
          background: "var(--color-bg-sidebar)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0 16px",
          flexShrink: 0,
        }}
      >
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--color-accent)" : "2px solid transparent",
                color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                padding: "0 16px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                height: "100%",
                transition: "all var(--duration-fast)",
                outline: "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Body */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        {activeTab === "overview" && (
          <div>
            <ProjectHeader project={project} />
            <ProjectDescription project={project} />
            <ProjectTechStack techStack={project.techStack} />
            <ProjectLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
          </div>
        )}

        {activeTab === "reel" && renderReelViewer()}
      </div>
    </AppContentArea>
  );
}
