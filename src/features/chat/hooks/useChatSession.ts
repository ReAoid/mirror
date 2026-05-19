import { useMemo } from "react";
import { useAgentStore } from "../../../stores/agentStore";
import { useChatStore } from "../../../stores/chatStore";
import { sendMessage } from "../services/chatSessionService";

export function useChatSession() {
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const messagesByConversationId = useChatStore((state) => state.messagesByConversationId);
  const createConversation = useChatStore((state) => state.createConversation);
  const clearConversation = useChatStore((state) => state.clearConversation);
  const isGenerating = useAgentStore((state) => state.isGenerating);
  const currentToolCall = useAgentStore((state) => state.currentToolCall);
  const lastError = useAgentStore((state) => state.lastError);

  const messages = useMemo(
    () => messagesByConversationId[activeConversationId] ?? [],
    [activeConversationId, messagesByConversationId],
  );

  return {
    activeConversationId,
    messages,
    isGenerating,
    currentToolCall,
    lastError,
    sendMessage,
    createConversation,
    clearConversation: () => clearConversation(activeConversationId),
  };
}
