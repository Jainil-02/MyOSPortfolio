export type ThemeMode = "light" | "dark" | "system";

export type SettingsState = {
  wallpaper: string;
  wallpaperVariant: "dark" | "light";
  theme: ThemeMode;
  lockScreenEnabled: boolean;
  accentColor: string;
};

const STORAGE_KEY = "my-os-portfolio-settings";

const defaultSettings: SettingsState = {
  wallpaper: "linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%)",
  wallpaperVariant: "dark",
  theme: "system",
  lockScreenEnabled: true,
  accentColor: "#10b981", // Teal/Green default
};

const ACCENT_HOVERS: Record<string, string> = {
  "#10b981": "#059669", // teal
  "#3b82f6": "#2563eb", // blue
  "#8b5cf6": "#7c3aed", // purple
  "#ec4899": "#db2777", // pink
  "#f59e0b": "#d97706", // amber
  "#f97316": "#ea580c", // orange
};

function applyAccentColor(color: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--color-accent", color);
  const hoverColor = ACCENT_HOVERS[color] || color;
  root.style.setProperty("--color-accent-hover", hoverColor);
}

function loadFromStorage(): SettingsState {
  if (typeof localStorage === "undefined") return { ...defaultSettings };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      applyAccentColor(defaultSettings.accentColor);
      return { ...defaultSettings };
    }
    const parsed = JSON.parse(stored);
    const resolved = { ...defaultSettings, ...parsed };
    applyAccentColor(resolved.accentColor);
    return resolved;
  } catch {
    applyAccentColor(defaultSettings.accentColor);
    return { ...defaultSettings };
  }
}

function saveToStorage(state: SettingsState) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full — silently ignore */
  }
}

let settingsState: SettingsState = loadFromStorage();

type SettingsSubscriber = (state: Readonly<SettingsState>) => void;
const settingsSubscribers = new Set<SettingsSubscriber>();

function broadcastSettingsState() {
  for (const subscriber of settingsSubscribers) {
    subscriber(settingsState);
  }
}

export function getSettings(): Readonly<SettingsState> {
  return settingsState;
}

export function updateSettings(partial: Partial<SettingsState>) {
  settingsState = { ...settingsState, ...partial };
  if (partial.accentColor) {
    applyAccentColor(partial.accentColor);
  }
  saveToStorage(settingsState);
  broadcastSettingsState();
}

export function resetSettings() {
  settingsState = { ...defaultSettings };
  applyAccentColor(defaultSettings.accentColor);
  saveToStorage(settingsState);
  broadcastSettingsState();
}

export function subscribeToSettings(subscriber: SettingsSubscriber) {
  settingsSubscribers.add(subscriber);
  subscriber(settingsState);

  return () => {
    settingsSubscribers.delete(subscriber);
  };
}
