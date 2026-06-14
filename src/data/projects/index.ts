import fs from "fs";
import path from "path";

import { projectCollectionSchema } from "@shared/schemas";
import { validateContent } from "@shared/validation";

// Aggregate all JSON files in this directory as project sources.
const dataDir = path.resolve(process.cwd(), "src", "data", "projects");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

const projectsJson: unknown[] = [];

for (const file of files) {
  const full = path.join(dataDir, file);
  try {
    const raw = fs.readFileSync(full, "utf8");
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      projectsJson.push(...parsed);
    } else if (parsed && typeof parsed === "object") {
      projectsJson.push(parsed as unknown);
    }
  } catch (err) {
    // If a single file fails to parse, surface it during validation by
    // attempting to validate the partial collection later. Keep going for
    // other files so a single malformed file doesn't mask others.
    // eslint-disable-next-line no-console
    console.warn(`Failed to read project file ${full}: ${(err as Error).message}`);
  }
}

export const projects = validateContent(
  "src/data/projects (aggregated)",
  projectCollectionSchema,
  projectsJson,
);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs() {
  return projects.map((project) => ({ slug: project.slug }));
}
