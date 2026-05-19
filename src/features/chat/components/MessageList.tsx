import type { ChatMessage } from "../types";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <section className="message-list" aria-label="聊天消息">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </section>
  );
}
