import { z } from "zod";

import {
  assetPathSchema,
  externalUrlSchema,
  identifierSchema,
  isoDateTimeSchema,
  nonEmptyTextSchema,
  slugSchema,
} from "./primitives.schema";

export const projectReelSchema = z
  .object({
    id: identifierSchema,
    projectId: identifierSchema,
    title: nonEmptyTextSchema,
    description: nonEmptyTextSchema,
    video: assetPathSchema.optional(),
    image: assetPathSchema.optional(),
    cta: nonEmptyTextSchema.optional(),
    order: z.number().int().nonnegative(),
    type: z.enum(["image", "video", "split", "text-only"]).optional(),
  })
  .refine((reel) => reel.video !== undefined || reel.image !== undefined, {
    message: "A project reel requires a video or image.",
    path: ["image"],
  });

export const projectNamedReelSchema = z.object({
  id: identifierSchema,
  projectId: identifierSchema,
  title: nonEmptyTextSchema,
  description: nonEmptyTextSchema.optional(),
  coverImage: assetPathSchema.optional(),
  order: z.number().int().nonnegative(),
  slides: z.array(projectReelSchema).min(1),
});

export const storyChapterSchema = z.object({
  id: identifierSchema,
  title: nonEmptyTextSchema,
  body: nonEmptyTextSchema,
  order: z.number().int().nonnegative(),
  media: z.array(assetPathSchema).default([]),
  reelId: identifierSchema.optional(),
});

export const projectSchema = z
  .object({
    id: identifierSchema,
    slug: slugSchema,
    title: nonEmptyTextSchema,
    shortDescription: nonEmptyTextSchema,
    fullDescription: nonEmptyTextSchema,
    category: nonEmptyTextSchema,
    techStack: z.array(nonEmptyTextSchema).min(1),
    githubUrl: externalUrlSchema.optional(),
    liveUrl: externalUrlSchema.optional(),
    thumbnail: assetPathSchema,
    coverImage: assetPathSchema,
    screenshots: z.array(assetPathSchema).default([]),
    demoVideo: assetPathSchema.optional(),
    featured: z.boolean().default(false),
    status: z.enum(["planned", "in-progress", "completed", "archived"]),
    timeline: nonEmptyTextSchema,
    role: nonEmptyTextSchema,
    teamSize: z.number().int().positive(),
    features: z.array(nonEmptyTextSchema).default([]),
    architectureHighlights: z.array(nonEmptyTextSchema).default([]),
    challenges: z.array(nonEmptyTextSchema).default([]),
    solutions: z.array(nonEmptyTextSchema).default([]),
    results: z.array(nonEmptyTextSchema).default([]),
    tags: z.array(nonEmptyTextSchema).default([]),
    reelSlides: z.array(projectReelSchema).min(1),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    reels: z.array(projectNamedReelSchema).optional(),
    storyChapters: z.array(storyChapterSchema).optional(),
    platform: z.enum(["web", "mobile", "desktop", "cli", "library", "other"]).optional(),
    displayOrder: z.number().int().nonnegative().optional(),
  })
  .superRefine((project, context) => {
    const reelIds = new Set<string>();
    const reelOrders = new Set<number>();

    for (const reel of project.reelSlides) {
      if (reel.projectId !== project.id) {
        context.addIssue({
          code: "custom",
          message: `Reel "${reel.id}" must reference project "${project.id}".`,
          path: ["reelSlides"],
        });
      }

      if (reelIds.has(reel.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate reel id "${reel.id}".`,
          path: ["reelSlides"],
        });
      }

      if (reelOrders.has(reel.order)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate reel order "${reel.order}".`,
          path: ["reelSlides"],
        });
      }

      reelIds.add(reel.id);
      reelOrders.add(reel.order);
    }

    // Validate reels (v2)
    const namedReelIds = new Set<string>();
    if (project.reels) {
      const namedReelOrders = new Set<number>();
      for (const reel of project.reels) {
        if (reel.projectId !== project.id) {
          context.addIssue({
            code: "custom",
            message: `Named reel "${reel.id}" must reference project "${project.id}".`,
            path: ["reels"],
          });
        }
        if (namedReelIds.has(reel.id)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate named reel id "${reel.id}".`,
            path: ["reels"],
          });
        }
        if (namedReelOrders.has(reel.order)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate named reel order "${reel.order}".`,
            path: ["reels"],
          });
        }
        namedReelIds.add(reel.id);
        namedReelOrders.add(reel.order);
      }
    }

    // Validate storyChapters (v2)
    if (project.storyChapters) {
      const chapterIds = new Set<string>();
      const chapterOrders = new Set<number>();
      for (const chapter of project.storyChapters) {
        if (chapterIds.has(chapter.id)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate chapter id "${chapter.id}".`,
            path: ["storyChapters"],
          });
        }
        if (chapterOrders.has(chapter.order)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate chapter order "${chapter.order}".`,
            path: ["storyChapters"],
          });
        }
        chapterIds.add(chapter.id);
        chapterOrders.add(chapter.order);

        if (chapter.reelId && project.reels && !namedReelIds.has(chapter.reelId)) {
          context.addIssue({
            code: "custom",
            message: `Chapter "${chapter.id}" references non-existent reel "${chapter.reelId}".`,
            path: ["storyChapters"],
          });
        }
      }
    }
  });

export const projectCollectionSchema = z.array(projectSchema).superRefine((projects, context) => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  projects.forEach((project, index) => {
    if (ids.has(project.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate project id "${project.id}".`,
        path: [index, "id"],
      });
    }

    if (slugs.has(project.slug)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate project slug "${project.slug}".`,
        path: [index, "slug"],
      });
    }

    ids.add(project.id);
    slugs.add(project.slug);
  });
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectReel = z.infer<typeof projectReelSchema>;
