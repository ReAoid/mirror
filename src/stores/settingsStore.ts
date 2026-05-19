import { create } from "zustand";
import { defaultSettings, loadSettings, saveSettings } from "../features/settings/services/settingsService";
import type { AppSettings } from "../features/settings/types";

type SettingsState = AppSettings & {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  isLoaded: false,
  loadSettings: async () => {
    const settings = await loadSettings();
    set({ ...settings, isLoaded: true });
  },
  saveSettings: async (settings) => {
    const nextSettings = { ...get(), ...settings };
    await saveSettings({
      modelProvider: nextSettings.modelProvider,
      modelName: nextSettings.modelName,
      openaiApiKey: nextSettings.openaiApiKey,
      anthropicApiKey: nextSettings.anthropicApiKey,
      deepseekApiKey: nextSettings.deepseekApiKey,
      temperature: nextSettings.temperature,
      maxTokens: nextSettings.maxTokens,
      enabledTools: nextSettings.enabledTools,
    });
    set(settings);
  },
}));
