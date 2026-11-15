import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useSetTaskDone() {
  return useCallback(async (id: string, done: boolean) => {
    await taskService.update(id, { status: done ? "completed" : "active" });
  }, []);
}
