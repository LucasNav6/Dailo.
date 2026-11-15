import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Fija o quita la fecha límite (YYYY-MM-DD) de una tarea. */
export function useSetTaskDeadline() {
  return useCallback(async (id: string, deadline: string | undefined) => {
    await taskService.update(id, { deadline });
  }, []);
}
