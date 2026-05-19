import { createId } from "../../../shared/lib/ids";
import { defaultSettings } from "../../settings/services/settingsService";
import { createModelConfig } from "../models/modelConfig";
import { defaultSystemPrompt } from "../prompts/systemPrompt";
import type { AgentEventHandler } from "./streamAdapter";
import { emitTextAsTokenStream } from "./streamAdapter";
import type { ChatMessage } from "../../chat/types";
import type { AppSettings } from "../../settings/types";
import { createAgentRuntime } from "./createAgentRuntime";

const runtime = createAgentRuntime();

export type RunAgentInput = {
  input: string;
  messages: ChatMessage[];
  settings?: AppSettings;
  onEvent: AgentEventHandler;
};

export async function runAgent({ input, messages, settings = defaultSettings, onEvent }: RunAgentInput) {
  const runId = createId("run");

  try {
    onEvent({ type: "run_started", runId });

    let receivedStreamingTokens = false;
    const handleRuntimeEvent: AgentEventHandler = (event) => {
      if (event.type === "token") {
        receivedStreamingTokens = true;
      }

      onEvent(event);
    };

    const response = await runtime.respond(
      input,
      {
        messages,
        model: createModelConfig(settings),
        systemPrompt: defaultSystemPrompt,
      },
      runId,
      handleRuntimeEvent,
    );

    if (!receivedStreamingTokens && response) {
      await emitTextAsTokenStream(runId, response, onEvent);
    }
    onEvent({ type: "run_finished", runId });
  } catch (error) {
    onEvent({
      type: "error",
      runId,
      message: error instanceof Error ? error.message : "Agent 运行失败",
    });
  }
}
