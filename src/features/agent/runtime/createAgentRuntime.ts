import { Agent } from "@earendil-works/pi-agent-core";
import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type { Api, AssistantMessage, Message, Model, Usage } from "@earendil-works/pi-ai";
import { createModelClient } from "../models/createModelClient";
import type { ChatMessage } from "../../chat/types";
import type { AgentContext } from "./agentContext";
import type { AgentEventHandler } from "./streamAdapter";
import { emitPiAgentEvent, getAssistantText } from "./streamAdapter";

export type AgentRuntime = {
  respond: (input: string, context: AgentContext, runId: string, onEvent: AgentEventHandler) => Promise<string>;
};

export function createAgentRuntime(): AgentRuntime {
  return {
    async respond(input, context, runId, onEvent) {
      const modelClient = createModelClient(context.model);
      const agent = new Agent({
        initialState: {
          systemPrompt: context.systemPrompt,
          model: modelClient.model,
          messages: toAgentMessages(context.messages, modelClient.model),
        },
        getApiKey: modelClient.getApiKey,
        toolExecution: "sequential",
      });

      agent.subscribe((event) => emitPiAgentEvent(runId, event, onEvent));

      await agent.prompt(input);

      const finalMessage = agent.state.messages[agent.state.messages.length - 1];
      const text = getAssistantText(finalMessage);

      if (!text && finalMessage?.role === "assistant" && finalMessage.errorMessage) {
        throw new Error(finalMessage.errorMessage);
      }

      return text;
    },
  };
}

const EMPTY_USAGE: Usage = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    total: 0,
  },
};

function toAgentMessages(messages: ChatMessage[], model: Model<Api>): AgentMessage[] {
  return messages.flatMap((message): Message[] => {
    const content = message.content.trim();

    if (!content || message.status === "streaming") {
      return [];
    }

    if (message.role === "user") {
      return [
        {
          role: "user",
          content,
          timestamp: message.createdAt,
        },
      ];
    }

    if (message.role === "assistant") {
      return [
        {
          role: "assistant",
          content: [{ type: "text", text: content }],
          api: model.api,
          provider: model.provider,
          model: model.id,
          usage: EMPTY_USAGE,
          stopReason: message.status === "error" ? "error" : "stop",
          errorMessage: message.status === "error" ? content : undefined,
          timestamp: message.createdAt,
        } satisfies AssistantMessage,
      ];
    }

    return [];
  });
}
