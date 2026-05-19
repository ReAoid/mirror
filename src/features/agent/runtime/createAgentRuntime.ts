import type { AgentContext } from "./agentContext";

export type AgentRuntime = {
  respond: (input: string, context: AgentContext) => Promise<string>;
};

export function createAgentRuntime(): AgentRuntime {
  return {
    async respond(input, context) {
      const latestMessages = context.messages
        .slice(-4)
        .map((message) => `${message.role}: ${message.content}`)
        .join("\n");

      return [
        `我收到你的消息：“${input}”。`,
        "",
        "这是 MVP 的模拟 Agent 响应，已经走通了 UI、Zustand 状态和运行时事件流。",
        `当前模型配置是 ${context.model.modelProvider} / ${context.model.modelName}。`,
        latestMessages ? `最近上下文：\n${latestMessages}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    },
  };
}
