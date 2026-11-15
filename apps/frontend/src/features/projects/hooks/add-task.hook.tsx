import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useAddTask(projectId: string) {
  return useCallback(
    async (title: string, description: string, sectionId?: string) => {
      await taskService.create({ title, description: description || undefined, projectId, sectionId, status: "active" });
    },
    [projectId]
  );
}
