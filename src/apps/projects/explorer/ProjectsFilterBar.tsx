import React from "react";
import AppTagBadge from "@shared/ui/AppTagBadge";
import { Project } from "@shared/schemas/project.schema";

export type ProjectFilter = {
  category: string | null;
  status: Project["status"] | null;
  featured: boolean;
};

type ProjectsFilterBarProps = {
  activeFilter: ProjectFilter;
  categories: string[];
  onChange: (filter: ProjectFilter) => void;
};

export default function ProjectsFilterBar({
  activeFilter,
  categories,
  onChange,
}: ProjectsFilterBarProps) {
  const isAllActive =
    activeFilter.category === null && activeFilter.status === null && !activeFilter.featured;

  const handleClear = () => {
    onChange({ category: null, status: null, featured: false });
  };

  const handleToggleFeatured = () => {
    onChange({ category: null, status: null, featured: !activeFilter.featured });
  };

  const handleSelectCategory = (cat: string) => {
    onChange({ category: cat, status: null, featured: false });
  };

  const handleSelectStatus = (status: Project["status"]) => {
    onChange({ category: null, status: status, featured: false });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "4px 0",
        overflowX: "auto",
        width: "100%",
        scrollbarWidth: "none", // Hide scrollbar in Firefox
      }}
      className="no-scrollbar"
    >
      {/* All */}
      <AppTagBadge
        variant={isAllActive ? "active" : "neutral"}
        onClick={handleClear}
        style={{ cursor: "pointer" }}
      >
        All
      </AppTagBadge>

      {/* Featured */}
      <AppTagBadge
        variant={activeFilter.featured ? "active" : "neutral"}
        onClick={handleToggleFeatured}
        style={{ cursor: "pointer" }}
      >
        Featured
      </AppTagBadge>

      {/* Categories */}
      {categories.map((cat) => {
        const isActive = activeFilter.category === cat;
        return (
          <AppTagBadge
            key={cat}
            variant={isActive ? "active" : "neutral"}
            onClick={() => handleSelectCategory(cat)}
            style={{ cursor: "pointer" }}
          >
            {cat}
          </AppTagBadge>
        );
      })}

      {/* Statuses */}
      <AppTagBadge
        variant={activeFilter.status === "completed" ? "active" : "neutral"}
        onClick={() => handleSelectStatus("completed")}
        style={{ cursor: "pointer" }}
      >
        Completed
      </AppTagBadge>

      <AppTagBadge
        variant={activeFilter.status === "in-progress" ? "active" : "neutral"}
        onClick={() => handleSelectStatus("in-progress")}
        style={{ cursor: "pointer" }}
      >
        In Progress
      </AppTagBadge>
    </div>
  );
}
