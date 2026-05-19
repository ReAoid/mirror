import { create } from "zustand";
import type { AgentStatus } from "../features/agent/types";

type AgentState = {
  status: AgentStatus;
  activeRunId?: string;
  isGenerating: boolean;
  currentToolCall?: string;
  lastError?: string;
  startRun: (runId: string) => void;
  finishRun: (runId: string) => void;
  failRun: (runId: string, message: string) => void;
  stopRun: () => void;
};

export const useAgentStore = create<AgentState>((set) => ({
  status: "idle",
  isGenerating: false,
  startRun: (runId) =>
    set({
      status: "running",
      activeRunId: runId,
      isGenerating: true,
      currentToolCall: undefined,
      lastError: undefined,
    }),
  finishRun: (runId) =>
    set((state) =>
      state.activeRunId === runId
        ? {
            status: "idle",
            activeRunId: undefined,
            isGenerating: false,
            currentToolCall: undefined,
          }
        : state,
    ),
  failRun: (runId, message) =>
    set((state) =>
      state.activeRunId === runId
        ? {
            status: "error",
            activeRunId: undefined,
            isGenerating: false,
            currentToolCall: undefined,
            lastError: message,
          }
        : state,
    ),
  stopRun: () =>
    set({
      status: "idle",
      activeRunId: undefined,
      isGenerating: false,
      currentToolCall: undefined,
    }),
}));
