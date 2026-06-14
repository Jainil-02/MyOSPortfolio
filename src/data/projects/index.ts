import { Project, projectCollectionSchema } from "@shared/schemas/project.schema";
import rawProjects from "./projects.json";

// Validate and parse projects at startup/load time
export const projects: Project[] = projectCollectionSchema.parse(rawProjects);

// Sorted projects by displayOrder, then fallback to title
export function getProjects(): Project[] {
  return [...projects].sort((a, b) => {
    const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProject(): Project | undefined {
  return projects.find((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  return getProjects().filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getProjectsByTag(tag: string): Project[] {
  return getProjects().filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export function getProjectsByStatus(status: Project["status"]): Project[] {
  return getProjects().filter((p) => p.status === status);
}

export function getAllProjectSlugs(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export function getAllCategories(): string[] {
  const categoriesSet = new Set<string>();
  projects.forEach((p) => {
    if (p.category) {
      categoriesSet.add(p.category);
    }
  });
  return Array.from(categoriesSet);
}

export function getAllTags(): string[] {
  const tagsSet = new Set<string>();
  projects.forEach((p) => {
    p.tags.forEach((t) => tagsSet.add(t));
  });
  return Array.from(tagsSet);
}

// Normalized reel shape — what the UI always receives
export type NormalizedReel = {
  id: string;
  title: string;
  description?: string | undefined;
  coverImage?: string | undefined;
  order: number;
  slides: NormalizedSlide[];
};

export type NormalizedSlide = {
  id: string;
  title: string;
  description: string;
  image?: string | undefined;
  video?: string | undefined;
  cta?: string | undefined;
  order: number;
  type?: "image" | "video" | "split" | "text-only" | undefined;
};

// Normalization function (v1 → NormalizedReel[])
// Returns a single-item array wrapping reelSlides as "Default Reel"
export function normalizeProjectReels(project: Project): NormalizedReel[] {
  if (project.reels && project.reels.length > 0) {
    // v2 path: use named reels
    return project.reels.map((reel) => ({
      id: reel.id,
      title: reel.title,
      description: reel.description,
      coverImage: reel.coverImage,
      order: reel.order,
      slides: reel.slides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        description: slide.description,
        image: slide.image,
        video: slide.video,
        cta: slide.cta,
        order: slide.order,
        type: slide.type ?? (slide.video ? "video" : slide.image ? "image" : "text-only"),
      })),
    }));
  }
  // v1 path: wrap reelSlides as a single default reel
  return [
    {
      id: `${project.id}-default-reel`,
      title: "Project Overview",
      description: undefined,
      coverImage: project.coverImage,
      order: 0,
      slides: project.reelSlides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        description: slide.description,
        image: slide.image,
        video: slide.video,
        cta: slide.cta,
        order: slide.order,
        type: slide.type ?? (slide.video ? "video" : slide.image ? "image" : "text-only"),
      })),
    },
  ];
}

// Search function prioritizing matching fields
export function searchProjects(query: string): Project[] {
  if (!query.trim()) return getProjects();
  const q = query.toLowerCase().trim();
  const seen = new Set<string>();
  const results: Project[] = [];

  const add = (p: Project) => {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      results.push(p);
    }
  };

  const list = getProjects();
  // Ordered by match priority
  list.filter((p) => p.title.toLowerCase().startsWith(q)).forEach(add);
  list.filter((p) => p.tags.some((t) => t.toLowerCase().includes(q))).forEach(add);
  list.filter((p) => p.shortDescription.toLowerCase().includes(q)).forEach(add);
  list.filter((p) => p.techStack.some((t) => t.toLowerCase().includes(q))).forEach(add);
  list.filter((p) => p.category.toLowerCase().includes(q)).forEach(add);
  list.filter((p) => p.fullDescription.toLowerCase().includes(q)).forEach(add);

  return results;
}
