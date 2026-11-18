"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { getProjects, getAllCategories, searchProjects } from "@data/projects";
import { subscribeToWindows, listWindows } from "@core/window-manager";
import ProjectsSidebar from "./explorer/ProjectsSidebar";
import { ProjectFilter } from "./explorer/ProjectsFilterBar";
import ProjectDetail from "./detail/ProjectDetail";
import ProjectEmptyState from "./detail/ProjectEmptyState";
import ProjectReelViewer from "./reel/ProjectReelViewer";

export default function ProjectsApp() {
  const allProjects = getProjects();
  const categories = useMemo(() => getAllCategories(), []);

  // Window Focus Subscriptions
  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => []);
  const isFocused = useMemo(() => {
    const win = windows.find((w) => w.appId === "projects");
    return win ? win.focused && !win.minimized : false;
  }, [windows]);

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

  // Transition Loading State
  const [isPending, setIsPending] = useState(false);

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
    setIsPending(true);
    setSelectedProjectId(id);
    setDetailTab("overview");
    setActiveReelId(null);
    setActiveSlideIndex(0);
    setTimeout(() => {
      setIsPending(false);
    }, 250); // Premium OS micro-delay
  };

  const handleClearFilters = () => {
    setActiveFilter({ category: null, status: null, featured: false });
    setSearchQuery("");
  };

  // Keyboard navigation for sidebar list
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClearFilters();
          target.blur();
        }
        return;
      }

      const currentIndex = visibleProjects.findIndex((p) => p.id === selectedProjectId);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex < visibleProjects.length - 1) {
          const nextProject = visibleProjects[currentIndex + 1];
          if (nextProject) {
            handleSelectProject(nextProject.id);
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          const prevProject = visibleProjects[currentIndex - 1];
          if (prevProject) {
            handleSelectProject(prevProject.id);
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClearFilters();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, visibleProjects, selectedProjectId]);

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
      <style>{`
        @keyframes os-app-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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

        {/* Transition Loading Overlay */}
        {isPending && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 15, 26, 0.4)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              transition: "all var(--duration-fast)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid rgba(255, 255, 255, 0.1)",
                borderTopColor: "var(--color-accent)",
                animation: "os-app-spin 0.8s linear infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
