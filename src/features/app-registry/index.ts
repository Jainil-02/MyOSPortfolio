import type { ComponentType } from "react";
import AboutApp from "../../apps/about";
import ProjectsApp from "../../apps/projects";
import SettingsApp from "../../apps/settings";
import ResumeApp from "../../apps/resume";
import ContactApp from "../../apps/contact";
import SkillsApp from "../../apps/skills";

/**
 * Minimal App Registry (features layer)
 *
 * Purpose: Provide a small, non-invasive registry of app metadata that
 * UI shells and launchers can consume. This lives in `src/features`
 * to avoid touching protected `src/core` systems.
 */
export type AppMeta = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  entry?: string;
  protected?: boolean;
  component?: ComponentType;
  defaultSize?: { width: number; height: number };
  pinned?: boolean;
};

const registry: AppMeta[] = [
  {
    id: "about",
    title: "About",
    description: "About MyOS and dev portfolio info",
    icon: "/icons/about.svg",
    entry: "/",
    component: AboutApp,
    defaultSize: { width: 720, height: 560 },
    pinned: true,
  },
  {
    id: "projects",
    title: "Projects",
    description: "Portfolio projects and reels",
    icon: "/icons/projects.svg",
    entry: "/apps/projects",
    component: ProjectsApp,
    defaultSize: { width: 960, height: 640 },
    pinned: true,
  },
  {
    id: "skills",
    title: "Skills",
    description: "Technical skills and expertise categories",
    icon: "/icons/skills.svg",
    entry: "/",
    component: SkillsApp,
    defaultSize: { width: 840, height: 580 },
    pinned: true,
  },
  {
    id: "resume",
    title: "Resume",
    description: "Professional document center",
    icon: "/icons/resume.svg",
    entry: "/",
    component: ResumeApp,
    defaultSize: { width: 820, height: 720 },
    pinned: false,
  },
  {
    id: "contact",
    title: "Contact",
    description: "Get in touch with Jainil Pandya",
    icon: "/icons/contact.svg",
    entry: "/",
    component: ContactApp,
    defaultSize: { width: 640, height: 480 },
    pinned: false,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure system options and preferences",
    icon: "/icons/settings.svg",
    entry: "/",
    component: SettingsApp,
    defaultSize: { width: 640, height: 480 },
  },
];

/** Return a read-only view of the current registry */
export function listApps(): ReadonlyArray<AppMeta> {
  return registry;
}

/** Find an app by id */
export function getApp(id: string): AppMeta | undefined {
  return registry.find((a) => a.id === id);
}

/**
 * Register a new app if the id is not already present.
 * This mutates in-memory registry only and is intentionally
 * lightweight for bootstrapping and tests.
 */
export function registerApp(app: AppMeta): void {
  if (!registry.find((a) => a.id === app.id)) {
    registry.push(app);
  }
}

const appRegistry = {
  listApps,
  getApp,
  registerApp,
};

export default appRegistry;
