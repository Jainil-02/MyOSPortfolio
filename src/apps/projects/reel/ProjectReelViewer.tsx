"use client";

import React from "react";
import { Project } from "@shared/schemas/project.schema";
import ReelPlayer from "@features/reels";
import { normalizeProjectReels } from "@data/projects";

type ProjectReelViewerProps = {
  project: Project;
  activeReelId: string | null;
  activeSlideIndex: number;
  onReelChange: (reelId: string) => void;
  onSlideChange: (index: number) => void;
  onEscape?: (() => void) | undefined;
};

export default function ProjectReelViewer({
  project,
  activeReelId,
  activeSlideIndex,
  onReelChange,
  onSlideChange,
  onEscape,
}: ProjectReelViewerProps) {
  const normalizedReels = normalizeProjectReels(project);

  const handleSlideChange = (reelId: string, slideIndex: number) => {
    if (activeReelId !== reelId) {
      onReelChange(reelId);
    }
    onSlideChange(slideIndex);
  };

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <ReelPlayer
        reels={normalizedReels}
        initialReelId={activeReelId || undefined}
        initialSlideIndex={activeSlideIndex}
        onSlideChange={handleSlideChange}
        onEscape={onEscape}
        showReelSelector={true}
        autoPlay={true}
      />
    </div>
  );
}
