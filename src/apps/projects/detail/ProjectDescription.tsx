import React from "react";
import { Project } from "@shared/schemas/project.schema";

type ProjectDescriptionProps = {
  project: Project;
};

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  const renderListSection = (label: string, items: string[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginTop: 20 }}>
        {/* Section Label */}
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
          {label}
        </div>
        {/* Separator Line */}
        <div
          style={{
            borderBottom: "1px solid var(--color-border)",
            marginBottom: 8,
          }}
        />
        {/* Bullet List */}
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: "1.6",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Description Section */}
      <div style={{ marginTop: 12 }}>
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
          Description
        </div>
        <div
          style={{
            borderBottom: "1px solid var(--color-border)",
            marginBottom: 8,
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {project.fullDescription}
        </p>
      </div>

      {/* Dynamic List Sections */}
      {renderListSection("Key Features", project.features)}
      {renderListSection("Challenges", project.challenges)}
      {renderListSection("Solutions", project.solutions)}
      {renderListSection("Results & Impact", project.results)}
    </div>
  );
}
