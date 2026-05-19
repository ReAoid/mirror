import type { AppSettings } from "../../settings/types";

export type ModelConfig = Pick<
  AppSettings,
  | "modelProvider"
  | "modelName"
  | "openaiApiKey"
  | "anthropicApiKey"
  | "deepseekApiKey"
  | "temperature"
  | "maxTokens"
>;

export function createModelConfig(settings: AppSettings): ModelConfig {
  return {
    modelProvider: settings.modelProvider,
    modelName: settings.modelName,
    openaiApiKey: settings.openaiApiKey,
    anthropicApiKey: settings.anthropicApiKey,
    deepseekApiKey: settings.deepseekApiKey,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
  };
}
