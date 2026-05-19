export type AgentStatus = "idle" | "running" | "error";

export type AgentEvent =
  | { type: "run_started"; runId: string }
  | { type: "token"; runId: string; text: string }
  | { type: "tool_call_started"; runId: string; toolName: string }
  | { type: "tool_call_finished"; runId: string; toolName: string; result: unknown }
  | { type: "error"; runId: string; message: string }
  | { type: "run_finished"; runId: string };
