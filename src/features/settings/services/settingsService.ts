import { invokeOptional } from "../../../shared/lib/tauri";
import type { AppSettings } from "../types";

const STORAGE_KEY = "mirror.settings";

export const defaultSettings: AppSettings = {
  modelProvider: "openai",
  modelName: "gpt-4o-mini",
  openaiApiKey: "",
  openaiBaseUrl: "https://api.openai.com/v1",
  anthropicApiKey: "",
  deepseekApiKey: "",
  deepseekBaseUrl: "https://api.deepseek.com/v1",
  temperature: 0.7,
  maxTokens: 2048,
  enabledTools: [],
};

export async function loadSettings(): Promise<AppSettings> {
  const tauriSettings = await invokeOptional<AppSettings>("load_settings");

  if (tauriSettings) {
    return { ...defaultSettings, ...tauriSettings };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const savedInTauri = await invokeOptional<boolean>("save_settings", { settings });

  if (!savedInTauri) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
