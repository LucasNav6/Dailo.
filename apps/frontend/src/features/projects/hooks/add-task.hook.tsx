import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Añade una tarea activa a un proyecto. */
export function useAddTask(projectId: string) {
  return useCallback(
    async (title: string, description: string) => {
      await taskService.create({ title, description: description || undefined, projectId, status: "active" });
    },
    [projectId]
  );
}
