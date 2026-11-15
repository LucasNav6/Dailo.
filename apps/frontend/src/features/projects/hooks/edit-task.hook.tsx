import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useEditTask() {
  return useCallback(async (id: string, edits: { title?: string; description?: string }) => {
    if (edits.title !== undefined && !edits.title.trim()) return;
    await taskService.update(id, { ...edits, description: edits.description?.trim() ? edits.description.trim() : undefined });
  }, []);
}
