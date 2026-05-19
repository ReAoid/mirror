import type { ChatMessage } from "../types";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <section className="message-list message-list-empty" aria-label="聊天消息">
        <p>当前会话还没有消息，输入一句话开始。</p>
      </section>
    );
  }

  return (
    <section className="message-list" aria-label="聊天消息">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </section>
  );
}
