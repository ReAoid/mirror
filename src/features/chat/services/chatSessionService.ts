import { runAgent } from "../../agent/runtime/agentRunner";
import type { AgentEvent } from "../../agent/types";
import { useAgentStore } from "../../../stores/agentStore";
import { useChatStore } from "../../../stores/chatStore";
import { useSettingsStore } from "../../../stores/settingsStore";
import { createId } from "../../../shared/lib/ids";

export async function sendMessage(content: string) {
  const text = content.trim();
  if (!text || useAgentStore.getState().isGenerating) {
    return;
  }

  const chatStore = useChatStore.getState();
  const conversationId = chatStore.activeConversationId;
  const history = chatStore.messagesByConversationId[conversationId] ?? [];
  const userMessage = {
    id: createId("msg"),
    role: "user" as const,
    content: text,
    createdAt: Date.now(),
    status: "done" as const,
  };
  const assistantMessageId = createId("msg");

  chatStore.appendMessage(conversationId, userMessage);
  chatStore.appendMessage(conversationId, {
    id: assistantMessageId,
    role: "assistant",
    content: "",
    createdAt: Date.now(),
    status: "streaming",
  });

  const handleEvent = (event: AgentEvent) => {
    const agentStore = useAgentStore.getState();
    const latestChatStore = useChatStore.getState();

    if (event.type === "run_started") {
      agentStore.startRun(event.runId);
      return;
    }

    if (event.type === "token") {
      latestChatStore.updateMessage(conversationId, assistantMessageId, (message) => ({
        content: message.content + event.text,
      }));
      return;
    }

    if (event.type === "tool_call_started") {
      agentStore.startToolCall(event.runId, event.toolName);
      return;
    }

    if (event.type === "tool_call_finished") {
      agentStore.finishToolCall(event.runId, event.toolName);
      return;
    }

    if (event.type === "run_finished") {
      latestChatStore.updateMessage(conversationId, assistantMessageId, { status: "done" });
      agentStore.finishRun(event.runId);
      return;
    }

    if (event.type === "error") {
      latestChatStore.updateMessage(conversationId, assistantMessageId, {
        content: event.message,
        status: "error",
      });
      agentStore.failRun(event.runId, event.message);
    }
  };

  await runAgent({
    input: text,
    messages: history,
    settings: useSettingsStore.getState(),
    onEvent: handleEvent,
  });
}
