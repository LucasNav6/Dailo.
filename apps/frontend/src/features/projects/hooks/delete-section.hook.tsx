import { useCallback } from "react";
import type { Task } from "@/models/task.model";
import { sectionService } from "@/services/section.service";
import { taskService } from "@/services/task.service";

export type DeleteSectionMode = "keep" | "delete-tasks";

export function useDeleteSection() {
  return useCallback(async (sectionId: string, tasks: Task[], mode: DeleteSectionMode) => {
    if (mode === "delete-tasks") for (const task of tasks) await taskService.remove(task.id);
    await sectionService.remove(sectionId);
  }, []);
}
