import { getModel } from "@earendil-works/pi-ai";
import type { Api, Model } from "@earendil-works/pi-ai";
import type { ModelConfig } from "./modelConfig";

const DEFAULT_CONTEXT_WINDOW = 128_000;
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

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
  if (config.modelProvider === "anthropic") {
    const model = getModel(config.modelProvider, config.modelName as never);

    if (!model) {
      throw new Error(`pi-ai 未注册模型：${config.modelProvider}/${config.modelName}`);
    }

    return model as Model<Api>;
  }

  if (config.modelProvider === "openai") {
    const baseUrl = config.openaiBaseUrl || DEFAULT_OPENAI_BASE_URL;
    const registeredModel = baseUrl === DEFAULT_OPENAI_BASE_URL ? getModel("openai", config.modelName as never) : undefined;

    return registeredModel ? (registeredModel as Model<Api>) : createOpenAiCompatibleModel(config.modelName, baseUrl, config.maxTokens);
  }

  if (config.modelProvider === "deepseek") {
    return createOpenAiCompatibleModel(
      config.modelName,
      config.deepseekBaseUrl || DEFAULT_DEEPSEEK_BASE_URL,
      config.maxTokens,
    );
  }

  throw new Error(`未支持的模型提供商：${config.modelProvider}`);
}

function resolveApiKey(config: ModelConfig, provider: string): string | undefined {
  if (config.modelProvider === "deepseek" && provider === "openai") {
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

function createOpenAiCompatibleModel(modelName: string, baseUrl: string, maxTokens: number): Model<Api> {
  return {
    id: modelName,
    name: modelName,
    api: "openai-completions",
    provider: "openai",
    baseUrl,
    reasoning: false,
    input: ["text"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: DEFAULT_CONTEXT_WINDOW,
    maxTokens,
  };
}
