export type ToolCatalogEntry = {
  id: string;
  label: string;
  description: string;
};

export const basicToolDefinitions: ToolCatalogEntry[] = [
  {
    id: "read_file",
    label: "读取文件",
    description: "读取指定路径的文件内容",
  },
  {
    id: "write_file",
    label: "写入文件",
    description: "将内容写入指定路径的文件",
  },
  {
    id: "run_shell",
    label: "执行命令",
    description: "在终端中执行 shell 命令",
  },
  {
    id: "web_search",
    label: "网页搜索",
    description: "搜索互联网获取最新信息",
  },
];

export const defaultEnabledTools: string[] = ["read_file", "run_shell"];

const toolLabelMap = new Map(basicToolDefinitions.map((tool) => [tool.id, tool.label]));

export function getToolLabel(toolName: string): string {
  return toolLabelMap.get(toolName) ?? toolName;
}
