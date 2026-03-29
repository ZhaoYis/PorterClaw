import { create } from 'zustand';
import { SettingsStore, AppSettings, DEFAULT_SETTINGS, ThemeMode, Language } from '@common/types/settings';

const STORAGE_KEY = 'porterclaw_settings';

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  let effectiveTheme: 'light' | 'dark' = 'dark';

  if (theme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    effectiveTheme = theme;
  }

  root.setAttribute('data-theme', effectiveTheme);
}

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const initial = loadSettings();
  // Apply theme on load
  setTimeout(() => applyTheme(initial.theme), 0);

  return {
    settings: initial,
    isLoading: false,

    setTheme: (theme: ThemeMode) => {
      const settings = { ...get().settings, theme };
      applyTheme(theme);
      saveSettings(settings);
      set({ settings });
    },

    setLanguage: (language: Language) => {
      const settings = { ...get().settings, language };
      saveSettings(settings);
      set({ settings });
    },

    setGatewayPort: (port: number) => {
      const settings = { ...get().settings, gatewayPort: port };
      saveSettings(settings);
      set({ settings });
    },

    setGatewayHost: (host: string) => {
      const settings = { ...get().settings, gatewayHost: host };
      saveSettings(settings);
      set({ settings });
    },

    resetSettings: () => {
      const settings = { ...DEFAULT_SETTINGS };
      applyTheme(settings.theme);
      saveSettings(settings);
      set({ settings });
    },
  };
});
