export type ThemeMode = 'system' | 'light' | 'dark';
export type Language = 'en' | 'zh';

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  gatewayPort: number;
  gatewayHost: string;
}

export interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
}

export interface SettingsActions {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setGatewayPort: (port: number) => void;
  setGatewayHost: (host: string) => void;
  resetSettings: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  gatewayPort: 18789,
  gatewayHost: 'localhost',
};
