import type { AgentEvent as PiAgentEvent, AgentMessage } from "@earendil-works/pi-agent-core";
import type { AssistantMessage } from "@earendil-works/pi-ai";
import type { AgentEvent } from "../types";

export type AgentEventHandler = (event: AgentEvent) => void;

export async function emitTextAsTokenStream(runId: string, text: string, onEvent: AgentEventHandler) {
  const chunks = text.match(/.{1,8}/gu) ?? [text];

  for (const chunk of chunks) {
    await new Promise((resolve) => window.setTimeout(resolve, 28));
    onEvent({ type: "token", runId, text: chunk });
  }
}

export function emitPiAgentEvent(runId: string, event: PiAgentEvent, onEvent: AgentEventHandler) {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    onEvent({ type: "token", runId, text: event.assistantMessageEvent.delta });
    return;
  }

  if (event.type === "tool_execution_start") {
    onEvent({ type: "tool_call_started", runId, toolName: event.toolName });
    return;
  }

  if (event.type === "tool_execution_end") {
    onEvent({ type: "tool_call_finished", runId, toolName: event.toolName, result: event.result });
  }
}

export function getAssistantText(message: AgentMessage | undefined): string {
  if (!message || message.role !== "assistant") {
    return "";
  }

  return (message as AssistantMessage).content
    .filter((content) => content.type === "text")
    .map((content) => content.text)
    .join("");
}
