export type ThemeMode = "light" | "dark" | "system";

export type SettingsState = {
  wallpaper: string;
  wallpaperVariant: "dark" | "light";
  theme: ThemeMode;
  lockScreenEnabled: boolean;
};

const STORAGE_KEY = "my-os-portfolio-settings";

const defaultSettings: SettingsState = {
  wallpaper: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  wallpaperVariant: "dark",
  theme: "system",
  lockScreenEnabled: true,
};

function loadFromStorage(): SettingsState {
  if (typeof localStorage === "undefined") return { ...defaultSettings };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultSettings };
    const parsed = JSON.parse(stored);
    return { ...defaultSettings, ...parsed };
  } catch {
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
  saveToStorage(settingsState);
  broadcastSettingsState();
}

export function resetSettings() {
  settingsState = { ...defaultSettings };
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
