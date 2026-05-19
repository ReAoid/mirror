import type { AppSettings } from "../../settings/types";

export type ModelConfig = Pick<AppSettings, "modelProvider" | "modelName" | "temperature" | "maxTokens">;

export function createModelConfig(settings: AppSettings): ModelConfig {
  return {
    modelProvider: settings.modelProvider,
    modelName: settings.modelName,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
  };
}
