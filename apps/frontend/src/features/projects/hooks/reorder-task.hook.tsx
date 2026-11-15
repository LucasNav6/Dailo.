import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useReorderTasks() {
  return useCallback(async (orderedIds: string[], sectionId: string | undefined, movedId: string) => {
    for (const [position, id] of orderedIds.entries()) {
      await taskService.update(id, id === movedId ? { position, sectionId } : { position });
    }
  }, []);
}
