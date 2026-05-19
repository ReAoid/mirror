import type { AppSettings } from "../../settings/types";

export type ModelConfig = Pick<
  AppSettings,
  | "modelProvider"
  | "modelName"
  | "openaiApiKey"
  | "openaiBaseUrl"
  | "anthropicApiKey"
  | "deepseekApiKey"
  | "deepseekBaseUrl"
  | "temperature"
  | "maxTokens"
>;

export function createModelConfig(settings: AppSettings): ModelConfig {
  return {
    modelProvider: settings.modelProvider,
    modelName: settings.modelName,
    openaiApiKey: settings.openaiApiKey,
    openaiBaseUrl: settings.openaiBaseUrl,
    anthropicApiKey: settings.anthropicApiKey,
    deepseekApiKey: settings.deepseekApiKey,
    deepseekBaseUrl: settings.deepseekBaseUrl,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
  };
}
