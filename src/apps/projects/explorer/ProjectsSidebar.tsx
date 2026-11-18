import React from "react";
import AppSidebar from "@shared/ui/AppSidebar";
import ProjectsSearch from "./ProjectsSearch";
import ProjectsFilterBar, { ProjectFilter } from "./ProjectsFilterBar";
import ProjectSidebarItem from "./ProjectSidebarItem";
import { Project } from "@shared/schemas/project.schema";

type ProjectsSidebarProps = {
  projects: Project[];
  selectedId: string | null;
  searchQuery: string;
  activeFilter: ProjectFilter;
  categories: string[];
  onSelect: (id: string) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: ProjectFilter) => void;
};

export default function ProjectsSidebar({
  projects,
  selectedId,
  searchQuery,
  activeFilter,
  categories,
  onSelect,
  onSearchChange,
  onFilterChange,
}: ProjectsSidebarProps) {
  const handleClearSearch = () => {
    onSearchChange("");
    onFilterChange({ category: null, status: null, featured: false });
  };

  return (
    <AppSidebar style={{ padding: 12, gap: 12 }}>
      {/* Search Header Bar */}
      <ProjectsSearch value={searchQuery} onChange={onSearchChange} />

      {/* Filter Chips Horizontally scrollable row */}
      <ProjectsFilterBar
        activeFilter={activeFilter}
        categories={categories}
        onChange={onFilterChange}
      />

      {/* Section Divider & Count */}
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-text-label)",
          fontWeight: 600,
          marginTop: 4,
          paddingLeft: 4,
        }}
      >
        ALL PROJECTS ({projects.length})
      </div>

      {/* Project Item List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        className="no-scrollbar"
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectSidebarItem
              key={project.id}
              project={project}
              isSelected={project.id === selectedId}
              onClick={() => onSelect(project.id)}
            />
          ))
        ) : (
          <div
            style={{
              padding: "40px 12px",
              textAlign: "center",
              fontSize: 13,
              color: "var(--color-text-muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>🔍</span>
            <div>No projects match &quot;{searchQuery || "current filters"}&quot;</div>
            <button
              onClick={handleClearSearch}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-accent)",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 12,
                padding: 0,
              }}
            >
              Clear search & filters
            </button>
          </div>
        )}
      </div>
    </AppSidebar>
  );
}
