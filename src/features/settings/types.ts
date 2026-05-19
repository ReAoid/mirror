export type ModelProvider = "openai" | "anthropic" | "deepseek";

export type AppSettings = {
  modelProvider: ModelProvider;
  modelName: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  anthropicApiKey: string;
  deepseekApiKey: string;
  deepseekBaseUrl: string;
  temperature: number;
  maxTokens: number;
  enabledTools: string[];
};
