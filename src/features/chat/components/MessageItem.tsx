import type { ChatMessage } from "../types";

type MessageItemProps = {
  message: ChatMessage;
};

export function MessageItem({ message }: MessageItemProps) {
  return (
    <article className={`message message-${message.role}`}>
      <div className="message-meta">
        <span>{message.role === "user" ? "你" : "Mirror Agent"}</span>
        {message.status === "streaming" ? <span>生成中</span> : null}
        {message.status === "error" ? <span>错误</span> : null}
      </div>
      <div className="message-content">{message.content || "..."}</div>
    </article>
  );
}
