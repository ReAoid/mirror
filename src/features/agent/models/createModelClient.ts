import { getModel } from "@earendil-works/pi-ai";
import type { Api, Model } from "@earendil-works/pi-ai";
import type { ModelConfig } from "./modelConfig";

export type ModelClient = {
  model: Model<Api>;
  getApiKey: (provider: string) => string | undefined;
};

export function createModelClient(config: ModelConfig): ModelClient {
  return {
    model: createPiModel(config),
    getApiKey: (provider) => resolveApiKey(config, provider),
  };
}

function createPiModel(config: ModelConfig): Model<Api> {
  const model = getModel(config.modelProvider, config.modelName as never);

  if (!model) {
    throw new Error(`pi-ai 未注册模型：${config.modelProvider}/${config.modelName}`);
  }

  return model as Model<Api>;
}

function resolveApiKey(config: ModelConfig, provider: string): string | undefined {
  if (provider === "deepseek") {
    return config.deepseekApiKey || undefined;
  }

  if (provider === "anthropic") {
    return config.anthropicApiKey || undefined;
  }

  if (provider === "openai") {
    return config.openaiApiKey || undefined;
  }

  return undefined;
}
