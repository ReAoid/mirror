import { invokeOptional } from "../../../shared/lib/tauri";
import { defaultEnabledTools } from "../../agent/tools/toolCatalog";
import type { AppSettings } from "../types";

const STORAGE_KEY = "mirror.settings";

export const defaultSettings: AppSettings = {
  modelProvider: "openai",
  modelName: "gpt-4o-mini",
  openaiApiKey: "",
  anthropicApiKey: "",
  deepseekApiKey: "",
  temperature: 0.7,
  maxTokens: 2048,
  enabledTools: defaultEnabledTools,
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
