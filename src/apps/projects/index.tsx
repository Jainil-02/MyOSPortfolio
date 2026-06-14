"use client";

import React, { useState, useMemo } from "react";
import { getProjects, getAllCategories, searchProjects } from "@data/projects";
import ProjectsSidebar from "./explorer/ProjectsSidebar";
import { ProjectFilter } from "./explorer/ProjectsFilterBar";
import ProjectDetail from "./detail/ProjectDetail";
import ProjectEmptyState from "./detail/ProjectEmptyState";
import ProjectReelViewer from "./reel/ProjectReelViewer";

export default function ProjectsApp() {
  const allProjects = getProjects();
  const categories = useMemo(() => getAllCategories(), []);

  // Explorer State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    allProjects[0]?.id || null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>({
    category: null,
    status: null,
    featured: false,
  });

  // Tab State
  const [detailTab, setDetailTab] = useState<"overview" | "reel" | "story">("overview");

  // Reel State (Lifted from ReelViewer to persist when switching tabs)
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Filter & Search Combination Logic
  const visibleProjects = useMemo(() => {
    const searched = searchProjects(searchQuery);
    return searched.filter((p) => {
      if (activeFilter.featured && !p.featured) return false;
      if (activeFilter.category && p.category !== activeFilter.category) return false;
      if (activeFilter.status && p.status !== activeFilter.status) return false;
      return true;
    });
  }, [searchQuery, activeFilter]);

  // Selected Project resolution
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return allProjects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, allProjects]);

  // Check if selected project is hidden by current search/filter settings
  const isSelectedHidden = useMemo(() => {
    if (!selectedProject) return false;
    return !visibleProjects.some((p) => p.id === selectedProject.id);
  }, [selectedProject, visibleProjects]);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setDetailTab("overview");
    setActiveReelId(null);
    setActiveSlideIndex(0);
  };

  const handleClearFilters = () => {
    setActiveFilter({ category: null, status: null, featured: false });
    setSearchQuery("");
  };

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
      {/* Sidebar - Explorer Mode */}
      <ProjectsSidebar
        projects={visibleProjects}
        selectedId={isSelectedHidden ? null : selectedProjectId}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        categories={categories}
        onSelect={handleSelectProject}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />

      {/* Main Details Panel */}
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        {isSelectedHidden && selectedProject ? (
          /* Notice Panel if project is hidden by active filter */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 24,
              textAlign: "center",
              background: "var(--color-bg-surface)",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 12 }}>👁️‍🌫️</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px 0" }}>
              Project Hidden by Filters
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                marginBottom: 16,
                maxWidth: 320,
              }}
            >
              The selected project &quot;{selectedProject.title}&quot; is currently hidden by your
              search query or filter chips.
            </p>
            <button
              onClick={handleClearFilters}
              style={{
                background: "var(--color-accent)",
                border: "none",
                borderRadius: 8,
                color: "var(--color-text-inverse)",
                padding: "8px 16px",
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
              Clear Filters
            </button>
          </div>
        ) : selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            activeTab={detailTab}
            onTabChange={setDetailTab}
            renderReelViewer={() => (
              <ProjectReelViewer
                project={selectedProject}
                activeReelId={activeReelId}
                activeSlideIndex={activeSlideIndex}
                onReelChange={setActiveReelId}
                onSlideChange={setActiveSlideIndex}
                onEscape={() => setDetailTab("overview")}
              />
            )}
          />
        ) : (
          <ProjectEmptyState />
        )}
      </div>
    </div>
  );
}
