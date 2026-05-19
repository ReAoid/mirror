import { create } from "zustand";
import { createId } from "../shared/lib/ids";
import type { ChatMessage, Conversation } from "../features/chat/types";

type ChatState = {
  conversations: Conversation[];
  activeConversationId: string;
  messagesByConversationId: Record<string, ChatMessage[]>;
  createConversation: () => string;
  setActiveConversation: (conversationId: string) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    patch: Partial<ChatMessage> | ((message: ChatMessage) => Partial<ChatMessage>),
  ) => void;
  clearConversation: (conversationId: string) => void;
};

const initialConversationId = createId("conv");
const initialConversation: Conversation = {
  id: initialConversationId,
  title: "新的会话",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [initialConversation],
  activeConversationId: initialConversationId,
  messagesByConversationId: {
    [initialConversationId]: [
      {
        id: createId("msg"),
        role: "assistant",
        content: "你好，我是 Mirror Agent MVP。现在已经接入 pi-agent-core，配置 API Key 后可以调用真实 LLM。",
        createdAt: Date.now(),
        status: "done",
      },
    ],
  },
  createConversation: () => {
    const conversationId = createId("conv");
    const now = Date.now();

    set((state) => ({
      conversations: [
        {
          id: conversationId,
          title: "新的会话",
          createdAt: now,
          updatedAt: now,
        },
        ...state.conversations,
      ],
      activeConversationId: conversationId,
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: [],
      },
    }));

    return conversationId;
  },
  setActiveConversation: (conversationId) =>
    set((state) => ({
      activeConversationId: state.conversations.some((conversation) => conversation.id === conversationId)
        ? conversationId
        : state.activeConversationId,
    })),
  appendMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: [...(state.messagesByConversationId[conversationId] ?? []), message],
      },
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title:
                conversation.title === "新的会话" && message.role === "user"
                  ? message.content.slice(0, 24) || conversation.title
                  : conversation.title,
              updatedAt: Date.now(),
            }
          : conversation,
      ),
    })),
  updateMessage: (conversationId, messageId, patch) =>
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: (state.messagesByConversationId[conversationId] ?? []).map((message) =>
          message.id === messageId
            ? {
                ...message,
                ...(typeof patch === "function" ? patch(message) : patch),
              }
            : message,
        ),
      },
    })),
  clearConversation: (conversationId) =>
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: [],
      },
    })),
}));
