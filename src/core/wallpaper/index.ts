import { subscribeToSettings } from "../settings";

export type WallpaperType = "gradient" | "image";

export type WallpaperVariant = "dark" | "light";

export type WallpaperConfig = {
  type: WallpaperType;
  value: string;
  variant: WallpaperVariant;
};

const defaultWallpaper: WallpaperConfig = {
  type: "gradient",
  value: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  variant: "dark",
};

let wallpaperState: WallpaperConfig = { ...defaultWallpaper };

type WallpaperSubscriber = (config: Readonly<WallpaperConfig>) => void;
const wallpaperSubscribers = new Set<WallpaperSubscriber>();

function applyCssVars(config: WallpaperConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--wp-bg", config.value);
  root.style.setProperty("--wp-type", config.type);
  root.style.setProperty("--wp-variant", config.variant);
}

function broadcastWallpaperState() {
  for (const subscriber of wallpaperSubscribers) {
    subscriber(wallpaperState);
  }
}

export function getWallpaper(): Readonly<WallpaperConfig> {
  return wallpaperState;
}

export function setWallpaper(config: Partial<WallpaperConfig>) {
  wallpaperState = { ...wallpaperState, ...config };
  applyCssVars(wallpaperState);
  broadcastWallpaperState();
}

export function subscribeToWallpaper(subscriber: WallpaperSubscriber) {
  wallpaperSubscribers.add(subscriber);
  subscriber(wallpaperState);

  return () => {
    wallpaperSubscribers.delete(subscriber);
  };
}

export function resetWallpaper() {
  wallpaperState = { ...defaultWallpaper };
  applyCssVars(wallpaperState);
  broadcastWallpaperState();
}

applyCssVars(wallpaperState);

if (typeof window !== "undefined") {
  subscribeToSettings((settings) => {
    setWallpaper({
      value: settings.wallpaper,
      variant: settings.wallpaperVariant,
    });
  });
}
