import type { ComponentType } from "react";
import AboutApp from "../../apps/about";
import ProjectsApp from "../../apps/projects";
import SettingsApp from "../../apps/settings";

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
    defaultSize: { width: 640, height: 480 },
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
