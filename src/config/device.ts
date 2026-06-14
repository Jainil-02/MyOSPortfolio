export const deviceBreakpoints = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1199,
  desktopMin: 1200,
} as const;

export type DeviceMode = "mobile" | "tablet" | "desktop";
