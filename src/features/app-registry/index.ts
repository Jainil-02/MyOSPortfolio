import type { ComponentType } from "react";
import AboutApp from "../../apps/about";
import ProjectsApp from "../../apps/projects";
import FilesApp from "../../apps/files";
import BrowserApp from "../../apps/browser";
import GalleryApp from "../../apps/gallery";
import TerminalApp from "../../apps/terminal";
import AchievementsApp from "../../apps/achievements";
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
  {
    id: "files",
    title: "Files",
    description: "File browser and document manager",
    icon: "/icons/files.svg",
    entry: "/apps/files",
    component: FilesApp,
    defaultSize: { width: 1100, height: 700 },
    pinned: true,
  },
  {
    id: "browser",
    title: "Browser",
    description: "Web browser with tabs and address bar",
    icon: "/icons/browser.svg",
    entry: "/apps/browser",
    component: BrowserApp,
    defaultSize: { width: 1000, height: 700 },
    pinned: true,
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "Image gallery with lightbox preview",
    icon: "/icons/gallery.svg",
    entry: "/apps/gallery",
    component: GalleryApp,
    defaultSize: { width: 900, height: 640 },
    pinned: true,
  },
  {
    id: "terminal",
    title: "Terminal",
    description: "Simulated command-line interface",
    icon: "/icons/terminal.svg",
    entry: "/apps/terminal",
    component: TerminalApp,
    defaultSize: { width: 760, height: 480 },
    pinned: false,
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Portfolio achievements and milestones",
    icon: "/icons/achievements.svg",
    entry: "/apps/achievements",
    component: AchievementsApp,
    defaultSize: { width: 720, height: 560 },
    pinned: false,
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
