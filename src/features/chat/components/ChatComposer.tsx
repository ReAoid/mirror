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
      <div className="composer-toolbar">
        <button aria-label="添加上下文" type="button">
          +
        </button>
        <button type="button">操作前询问</button>
      </div>
      <textarea
        aria-label="输入消息"
        disabled={disabled}
        placeholder="选中桌面任意文字，会浮出一个临时输入框"
        rows={3}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="composer-footer">
        <span>Qwen3.5 122b A10b</span>
        <button disabled={disabled || !content.trim()} type="submit">
          {disabled ? "生成中" : "发送"}
        </button>
      </div>
    </form>
  );
}
