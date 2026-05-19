import type { ChatMessage } from "../../chat/types";
import type { ModelConfig } from "../models/modelConfig";

export type AgentContext = {
  messages: ChatMessage[];
  model: ModelConfig;
  systemPrompt: string;
  enabledTools: string[];
};
