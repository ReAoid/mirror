import type { AgentEvent } from "../types";

export type AgentEventHandler = (event: AgentEvent) => void;

export async function emitTextAsTokenStream(runId: string, text: string, onEvent: AgentEventHandler) {
  const chunks = text.match(/.{1,8}/gu) ?? [text];

  for (const chunk of chunks) {
    await new Promise((resolve) => window.setTimeout(resolve, 28));
    onEvent({ type: "token", runId, text: chunk });
  }
}
