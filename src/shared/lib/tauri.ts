import { invoke } from "@tauri-apps/api/core";

export async function invokeOptional<T>(command: string, args?: Record<string, unknown>): Promise<T | undefined> {
  if (!("__TAURI_INTERNALS__" in window)) {
    return undefined;
  }

  return invoke<T>(command, args);
}
