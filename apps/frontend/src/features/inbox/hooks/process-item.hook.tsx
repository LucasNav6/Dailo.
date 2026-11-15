import { useCallback } from "react";
import type { InboxDecision } from "@/services/task.service";
import { taskService } from "@/services/task.service";

/** Decide qué hacer con un elemento de Inbox (activar, algún día, completar o descartar). */
export function useProcessItem() {
  return useCallback(
    (id: string, decision: InboxDecision, edits: { title?: string; description?: string } = {}) => taskService.decide(id, decision, edits),
    []
  );
}
