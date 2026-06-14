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
};

const registry: AppMeta[] = [
  {
    id: "projects",
    title: "Projects",
    description: "Portfolio projects and reels",
    icon: "/icons/projects.svg",
    entry: "/apps/projects",
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

export default {
  listApps,
  getApp,
  registerApp,
};
