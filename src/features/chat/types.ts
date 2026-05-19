export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  status?: "streaming" | "done" | "error";
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};
