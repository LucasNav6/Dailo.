import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useEditItem() {
  return useCallback((id: string, edits: { title?: string; description?: string }) => taskService.update(id, edits), []);
}
