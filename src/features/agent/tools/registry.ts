import type { AgentTool } from "@earendil-works/pi-agent-core";
import { Type } from "typebox";

const readFileTool: AgentTool = {
  name: "read_file",
  label: "读取文件",
  description: "读取指定路径的文件内容",
  parameters: Type.Object({
    path: Type.String({ description: "文件路径" }),
  }),
  async execute(_toolCallId, params) {
    return { content: [{ type: "text", text: `读取文件: ${params.path}` }], details: {} };
  },
};

const writeFileTool: AgentTool = {
  name: "write_file",
  label: "写入文件",
  description: "将内容写入指定路径的文件",
  parameters: Type.Object({
    path: Type.String({ description: "文件路径" }),
    content: Type.String({ description: "要写入的内容" }),
  }),
  async execute(_toolCallId, params) {
    return {
      content: [{ type: "text", text: `写入文件: ${params.path}` }],
      details: {},
    };
  },
};

const runShellTool: AgentTool = {
  name: "run_shell",
  label: "执行命令",
  description: "在终端中执行 shell 命令",
  parameters: Type.Object({
    command: Type.String({ description: "要执行的命令" }),
  }),
  async execute(_toolCallId, params) {
    return {
      content: [{ type: "text", text: `执行命令: ${params.command}` }],
      details: {},
    };
  },
};

const webSearchTool: AgentTool = {
  name: "web_search",
  label: "网页搜索",
  description: "搜索互联网获取最新信息",
  parameters: Type.Object({
    query: Type.String({ description: "搜索关键词" }),
  }),
  async execute(_toolCallId, params) {
    return {
      content: [{ type: "text", text: `搜索: ${params.query}` }],
      details: {},
    };
  },
};

const toolMap = new Map<string, AgentTool>([
  ["read_file", readFileTool],
  ["write_file", writeFileTool],
  ["run_shell", runShellTool],
  ["web_search", webSearchTool],
]);

export function getEnabledAgentTools(enabledToolIds: string[]): AgentTool[] {
  return enabledToolIds
    .map((id) => toolMap.get(id))
    .filter((tool): tool is AgentTool => tool !== undefined);
}
