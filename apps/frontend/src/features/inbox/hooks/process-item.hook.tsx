import { useCallback } from "react";
import type { InboxDecision } from "@/services/task.service";
import { taskService } from "@/services/task.service";

export function useProcessItem() {
  return useCallback(
    (id: string, decision: InboxDecision, edits: { title?: string; description?: string } = {}) => taskService.decide(id, decision, edits),
    []
  );
}
