import { useEffect } from "react";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useChatSession } from "../hooks/useChatSession";
import { ChatComposer } from "./ChatComposer";
import { MessageList } from "./MessageList";

export function ChatShell() {
  const { messages, isGenerating, lastError, sendMessage, createConversation, clearConversation } = useChatSession();
  const settings = useSettingsStore();

  useEffect(() => {
    if (!settings.isLoaded) {
      void settings.loadSettings();
    }
  }, [settings]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Mirror Agent</p>
          <h1>桌面 Agent MVP</h1>
          <p className="muted">React + Zustand + Tauri 的最小聊天闭环。</p>
        </div>

        <div className="sidebar-card">
          <span>模型</span>
          <strong>{settings.modelName}</strong>
          <small>{settings.modelProvider}</small>
        </div>

        <div className="sidebar-actions">
          <button onClick={createConversation} type="button">
            新会话
          </button>
          <button onClick={clearConversation} type="button">
            清空当前会话
          </button>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Chat</p>
            <h2>与 Agent 对话</h2>
          </div>
          <span className={`status-pill ${isGenerating ? "status-running" : ""}`}>
            {isGenerating ? "运行中" : "空闲"}
          </span>
        </header>

        <MessageList messages={messages} />

        {lastError ? <p className="error-text">{lastError}</p> : null}
        <ChatComposer disabled={isGenerating} onSend={sendMessage} />
      </section>
    </main>
  );
}
