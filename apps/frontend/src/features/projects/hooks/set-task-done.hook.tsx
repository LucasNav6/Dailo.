import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Marca una tarea o subtarea como hecha, o la reabre. */
export function useSetTaskDone() {
  return useCallback(async (id: string, done: boolean) => {
    await taskService.update(id, { status: done ? "completed" : "active" });
  }, []);
}
