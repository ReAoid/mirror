export type ModelProvider = "openai" | "anthropic" | "deepseek";

export type AppSettings = {
  modelProvider: ModelProvider;
  modelName: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  deepseekApiKey: string;
  temperature: number;
  maxTokens: number;
  enabledTools: string[];
};
