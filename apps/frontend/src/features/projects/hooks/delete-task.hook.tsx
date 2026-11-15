import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useDeleteTask() {
  return useCallback(async (id: string) => {
    await taskService.remove(id);
  }, []);
}
