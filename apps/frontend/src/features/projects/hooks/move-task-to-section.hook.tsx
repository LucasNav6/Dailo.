import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useMoveTaskToSection() {
  return useCallback(async (taskId: string, sectionId: string | undefined) => {
    await taskService.update(taskId, { sectionId });
  }, []);
}
