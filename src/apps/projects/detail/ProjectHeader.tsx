import React from "react";
import { Project } from "@shared/schemas/project.schema";
import AppTagBadge from "@shared/ui/AppTagBadge";

type ProjectHeaderProps = {
  project: Project;
};

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const devLabel = project.teamSize === 1 ? "1 dev" : `${project.teamSize} devs`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingBottom: 16,
      }}
    >
      {/* Title & Status Badge Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: 0,
            lineHeight: "1.2",
          }}
        >
          {project.title}
        </h1>

        <AppTagBadge variant="status" statusType={project.status} />
      </div>

      {/* Metadata Row */}
      <div
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{project.category}</span>
        <span style={{ color: "var(--color-text-muted)" }}>•</span>
        <span>{project.timeline}</span>
        <span style={{ color: "var(--color-text-muted)" }}>•</span>
        <span>{project.role}</span>
        <span style={{ color: "var(--color-text-muted)" }}>•</span>
        <span>{devLabel}</span>
      </div>
    </div>
  );
}
