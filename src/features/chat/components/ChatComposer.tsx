import { FormEvent, useState } from "react";

type ChatComposerProps = {
  disabled?: boolean;
  onSend: (content: string) => void | Promise<void>;
};

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [content, setContent] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = content.trim();

    if (!text) {
      return;
    }

    setContent("");
    await onSend(text);
  }

  return (
    <form className="chat-composer" onSubmit={handleSubmit}>
      <textarea
        aria-label="输入消息"
        disabled={disabled}
        placeholder="输入消息，按发送开始调用 LLM..."
        rows={3}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button disabled={disabled || !content.trim()} type="submit">
        {disabled ? "生成中" : "发送"}
      </button>
    </form>
  );
}
