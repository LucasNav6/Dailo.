import { useCallback } from "react";
import type { Task } from "@/models/task.model";
import { taskService } from "@/services/task.service";

/** Añade una subtarea a una tarea; hereda su proyecto. */
export function useAddSubtask() {
  return useCallback(async (parent: Task, title: string) => {
    await taskService.create({ title, parentId: parent.id, projectId: parent.projectId, status: "active" });
  }, []);
}
