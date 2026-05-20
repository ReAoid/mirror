import { useEffect, useState, type MouseEvent } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { AppLayout } from "../../../app/AppLayout";
import { getToolLabel } from "../../agent/tools/toolCatalog";
import { useLayoutStore } from "../../../stores/layoutStore";
import { useSettingsStore } from "../../../stores/settingsStore";
import { useChatSession } from "../hooks/useChatSession";
import { ChatComposer } from "./ChatComposer";
import { MessageList } from "./MessageList";

const IS_WINDOWS = /Windows/i.test(navigator.userAgent);

function handleTitlebarMouseDown(event: MouseEvent<HTMLDivElement>) {
  if (event.button !== 0 || event.target !== event.currentTarget || !("__TAURI_INTERNALS__" in window)) {
    return;
  }

  void getCurrentWindow().startDragging();
}

export function ChatShell() {
  const {
    conversations,
    activeConversationId,
    messages,
    isGenerating,
    currentToolCall,
    lastError,
    sendMessage,
    createConversation,
    setActiveConversation,
    clearConversation,
  } = useChatSession();
  const settings = useSettingsStore();
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const previewOpen = useLayoutStore((state) => state.previewOpen);
  const workspaceOpen = useLayoutStore((state) => state.workspaceOpen);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const togglePreview = useLayoutStore((state) => state.togglePreview);
  const toggleWorkspace = useLayoutStore((state) => state.toggleWorkspace);

  useEffect(() => {
    if (!settings.isLoaded) {
      void settings.loadSettings();
    }
  }, [settings]);

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!IS_WINDOWS || !("__TAURI_INTERNALS__" in window)) return;

    const win = getCurrentWindow();
    let active = true;

    win.isMaximized().then((v) => {
      if (active) setIsMaximized(v);
    });

    let unlisten: (() => void) | undefined;
    win.onResized(() => {
      win.isMaximized().then((v) => {
        if (active) setIsMaximized(v);
      });
    }).then((fn) => {
      if (active) unlisten = fn;
    });

    return () => {
      active = false;
      unlisten?.();
    };
  }, []);

  const handleMinimize = () => {
    if (!("__TAURI_INTERNALS__" in window)) return;
    void getCurrentWindow().minimize();
  };

  const handleToggleMaximize = () => {
    if (!("__TAURI_INTERNALS__" in window)) return;
    void getCurrentWindow().toggleMaximize();
  };

  const handleClose = () => {
    if (!("__TAURI_INTERNALS__" in window)) return;
    void getCurrentWindow().close();
  };

  return (
    <AppLayout
      titlebar={
        <div className="titlebar" data-tauri-drag-region onMouseDown={handleTitlebarMouseDown}>
          <button
            className={`tb-toggle tb-toggle-left${sidebarOpen ? " active" : ""}`}
            title="切换侧边栏"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggleSidebar}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <div className="channel-tab-bar" aria-label="模式切换">
            <button className="channel-tab active" type="button">
              聊天
            </button>
            <button className="channel-tab" type="button">
              画布
            </button>
          </div>
          <div className="tb-right-group">
            <button
              className={`tb-toggle tb-toggle-preview${previewOpen ? " active" : ""}`}
              title="切换预览"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={togglePreview}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 3.5h7l3 3v14H7z" />
                <path d="M14 3.5v3h3" />
                <path d="M9.5 11h5" />
                <path d="M9.5 14.5h5" />
              </svg>
            </button>
            <button
              className={`tb-toggle tb-toggle-right${workspaceOpen ? " active" : ""}`}
              title="切换工作区"
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={toggleWorkspace}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>
            {IS_WINDOWS && (
              <>
                <div className="win-controls-sep" />
                <button
                  className="win-control-btn win-minimize"
                  title="最小化"
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleMinimize}
                  aria-label="最小化"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="0.5" y="4.5" width="9" height="1" fill="currentColor" />
                  </svg>
                </button>
                <button
                  className="win-control-btn win-maximize"
                  title={isMaximized ? "还原" : "最大化"}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleToggleMaximize}
                  aria-label={isMaximized ? "还原" : "最大化"}
                >
                  {isMaximized ? (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M2 2V0.5h7V7.5H7.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      <rect x="0.5" y="2.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <rect x="0.5" y="0.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
                <button
                  className="win-control-btn win-close"
                  title="关闭"
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleClose}
                  aria-label="关闭"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      }
      sidebar={
        <>
          <div className="sidebar-chat-content">
            <div className="sidebar-header">
              <span className="sidebar-title">对话</span>
              <div className="sidebar-header-actions">
                <button className="sidebar-action-btn" title="新对话" type="button" onClick={createConversation}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button className="sidebar-action-btn" title="收起侧边栏" type="button" onClick={toggleSidebar}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 6 9 12 15 18" />
                  </svg>
                </button>
              </div>
            </div>

            <button className="sidebar-activity-bar sidebar-bridge-card" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>接入社交平台</span>
              <span className="sidebar-bridge-dot connected" />
            </button>

            <button className="sidebar-activity-bar" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <span>助手活动</span>
            </button>

            <button className="sidebar-activity-bar" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>任务计划</span>
            </button>

            <div className="session-list">
              <div className="session-day-label">今天</div>
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`session-item ${
                    conversation.id === activeConversationId ? "conversation-item-active" : ""
                  }`}
                  type="button"
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <span>{conversation.title}</span>
                  <small>{new Date(conversation.updatedAt).toLocaleDateString()}</small>
                </button>
              ))}
            </div>

            <div className="sidebar-footer">
              <button className="sidebar-action-btn sidebar-footer-btn" title="设置" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button className="sidebar-action-btn sidebar-footer-btn" title="清空当前会话" type="button" onClick={clearConversation}>
                清
              </button>
            </div>
          </div>
        </>
      }
      preview={
        <div className="preview-card">
          <div className="panel-title-row">
            <span>Preview</span>
            <button className="sidebar-action-btn" type="button" onClick={togglePreview}>
              ×
            </button>
          </div>
          <div className="preview-empty-state">
            <p>选择文件、工具结果或画布后会在这里预览。</p>
            <small>Mirror 当前先保留 OpenHanako 式预览栏位。</small>
          </div>
        </div>
      }
      workspace={
        <div className="jian-card desktop-panel">
          <div className="panel-title-row">
            <span>Desktop</span>
            <button className="sidebar-action-btn" type="button" onClick={toggleWorkspace}>
              ×
            </button>
          </div>
          <div className="desktop-switcher">
            <button className="desktop-switch active" type="button">对话文件</button>
            <button className="desktop-switch" type="button">工作空间</button>
          </div>
          <div className="desktop-tools">
            <input aria-label="搜索工作空间" placeholder="搜索工作空间" />
            <div className="desktop-tool-row">
              <span>□</span>
              <span>过滤</span>
              <span>时间</span>
            </div>
          </div>
          <div className="desktop-tree">
            <div className="desktop-tree-item">
              <span>▸</span>
              <span>□</span>
              <span>HeartBeat</span>
            </div>
          </div>
          <div className="desktop-note-composer">
            <span>笺</span>
            <button type="button">⌃</button>
          </div>
        </div>
      }
    >
      <div className={`chat-area${messages.length === 0 ? " welcome-mode" : ""}`}>
        <div className="welcome-stack">
          <div className="agent-avatar" aria-hidden="true">
            M
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Mirror Agent</p>
            <h2>{messages.length > 0 ? "继续你的对话" : "有什么需要帮忙的吗？"}</h2>
            <p className="muted">选择一个会话，或直接输入问题开始调用桌面 Agent。</p>
          </div>
        </div>

        <MessageList messages={messages} />
      </div>

      <div className="input-area">
        <div className="composer-status">
          <span className={`status-pill ${isGenerating ? "status-running" : ""}`}>
            {currentToolCall ? `工具：${getToolLabel(currentToolCall)}` : isGenerating ? "运行中" : "空闲"}
          </span>
          <span>
            {settings.modelProvider} · {settings.modelName}
          </span>
        </div>
        {lastError ? <p className="error-text">{lastError}</p> : null}
        <ChatComposer disabled={isGenerating} onSend={sendMessage} />
      </div>
    </AppLayout>
  );
}
