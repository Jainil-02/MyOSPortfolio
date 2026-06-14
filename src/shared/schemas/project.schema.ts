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
  })
  .refine((reel) => reel.video !== undefined || reel.image !== undefined, {
    message: "A project reel requires a video or image.",
    path: ["image"],
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
    challenges: z.array(nonEmptyTextSchema).default([]),
    solutions: z.array(nonEmptyTextSchema).default([]),
    results: z.array(nonEmptyTextSchema).default([]),
    tags: z.array(nonEmptyTextSchema).default([]),
    reelSlides: z.array(projectReelSchema).min(1),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
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
