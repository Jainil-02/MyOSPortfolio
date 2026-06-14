import React from "react";
import AppTagBadge from "@shared/ui/AppTagBadge";

type ProjectTechStackProps = {
  techStack: string[];
};

export default function ProjectTechStack({ techStack }: ProjectTechStackProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      {/* Label */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-text-label)",
          marginBottom: 6,
        }}
      >
        Tech Stack
      </div>
      {/* Separator Line */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          marginBottom: 8,
        }}
      />
      {/* Badges Flexbox Wrapper */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {techStack.map((tech) => (
          <AppTagBadge key={tech} variant="tech">
            {tech}
          </AppTagBadge>
        ))}
      </div>
    </div>
  );
}
