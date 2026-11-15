import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Edita título y descripción de un elemento sin sacarlo de Inbox. */
export function useEditItem() {
  return useCallback((id: string, edits: { title?: string; description?: string }) => taskService.update(id, edits), []);
}
