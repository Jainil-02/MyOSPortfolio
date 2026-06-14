import React, { useState } from "react";
import { Project } from "@shared/schemas/project.schema";

type ProjectSidebarItemProps = {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
};

export default function ProjectSidebarItem({
  project,
  isSelected,
  onClick,
}: ProjectSidebarItemProps) {
  const [imageError, setImageError] = useState(false);

  // Status dot color mapping
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "var(--color-accent)";
      case "in-progress":
        return "#fbbf24";
      case "planned":
        return "#64748b";
      case "archived":
        return "#475569";
      default:
        return "#64748b";
    }
  };

  const statusColor = getStatusColor(project.status);
  const firstLetter = project.title.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        height: 64,
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        background: isSelected ? "var(--color-bg-sidebar-active)" : "transparent",
        textAlign: "left",
        cursor: "pointer",
        transition: "all var(--duration-fast)",
        color: isSelected ? "#ffffff" : "var(--color-text-primary)",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "var(--color-surface-1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {/* Thumbnail */}
      {project.thumbnail && !imageError ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          onError={() => setImageError(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            objectFit: "cover",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-text-secondary)",
          }}
        >
          {firstLetter}
        </div>
      )}

      {/* Title & Metadata */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: isSelected ? "#ffffff" : "var(--color-text-primary)",
            }}
          >
            {project.title}
          </div>
          {/* Status Dot */}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: statusColor,
              flexShrink: 0,
            }}
            title={project.status}
          />
        </div>

        <div
          style={{
            fontSize: 11,
            color: isSelected ? "rgba(255, 255, 255, 0.7)" : "var(--color-text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: 2,
          }}
        >
          {project.category} • {project.timeline}
        </div>
      </div>
    </button>
  );
}
