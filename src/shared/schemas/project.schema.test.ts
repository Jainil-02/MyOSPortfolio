import { describe, expect, it } from "vitest";

import { projectCollectionSchema, projectSchema } from "./project.schema";

const validProject = {
  id: "my-os-portfolio",
  slug: "my-os-portfolio",
  title: "My OS Portfolio",
  shortDescription: "A browser-based personal operating system portfolio.",
  fullDescription: "An interactive portfolio organized as an operating system.",
  category: "Web Application",
  techStack: ["Next.js", "TypeScript"],
  thumbnail: "/media/projects/my-os-portfolio/thumbnail.webp",
  coverImage: "/media/projects/my-os-portfolio/cover.webp",
  screenshots: [],
  featured: true,
  status: "in-progress",
  timeline: "2026",
  role: "Designer and developer",
  teamSize: 1,
  features: [],
  challenges: [],
  solutions: [],
  results: [],
  tags: ["portfolio"],
  reelSlides: [
    {
      id: "my-os-overview",
      projectId: "my-os-portfolio",
      title: "Overview",
      description: "Project overview.",
      image: "/media/projects/my-os-portfolio/cover.webp",
      order: 0,
    },
  ],
  createdAt: "2026-06-13T00:00:00+05:30",
  updatedAt: "2026-06-13T00:00:00+05:30",
} as const;

describe("projectSchema", () => {
  it("accepts a valid project with one reel", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("rejects a reel that references another project", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      reelSlides: [{ ...validProject.reelSlides[0], projectId: "another-project" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate project slugs", () => {
    const result = projectCollectionSchema.safeParse([
      validProject,
      { ...validProject, id: "another-project" },
    ]);

    expect(result.success).toBe(false);
  });
});
