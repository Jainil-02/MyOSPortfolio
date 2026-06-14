export const designToken = {
  color: {
    accent: "var(--color-accent)",
    accentContrast: "var(--color-accent-contrast)",
    focusRing: "var(--color-focus-ring)",
    surfaceDesktop: "var(--color-surface-desktop)",
    surfacePanel: "var(--color-surface-panel)",
    surfaceWindow: "var(--color-surface-window)",
    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--os-color-text-secondary)",
  },
  duration: {
    fast: "var(--duration-fast)",
    normal: "var(--duration-normal)",
    slow: "var(--duration-slow)",
    extraSlow: "var(--duration-extra-slow)",
  },
  radius: {
    small: "var(--radius-small)",
    medium: "var(--radius-medium)",
    large: "var(--radius-large)",
    window: "var(--radius-window)",
    modal: "var(--radius-modal)",
    taskbar: "var(--radius-taskbar)",
  },
  shadow: {
    small: "var(--shadow-small)",
    medium: "var(--shadow-medium)",
    large: "var(--shadow-large)",
    window: "var(--shadow-window)",
    dialog: "var(--shadow-dialog)",
  },
} as const;

export type DesignToken = typeof designToken;
