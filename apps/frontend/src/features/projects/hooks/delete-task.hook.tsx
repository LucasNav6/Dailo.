import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Elimina una tarea con sus subtareas y adjuntos. */
export function useDeleteTask() {
  return useCallback(async (id: string) => {
    await taskService.remove(id);
  }, []);
}
