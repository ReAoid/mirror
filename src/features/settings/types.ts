export type ModelProvider = "openai-compatible" | "anthropic" | "local";

export type AppSettings = {
  modelProvider: ModelProvider;
  modelName: string;
  temperature: number;
  maxTokens: number;
  enabledTools: string[];
};
