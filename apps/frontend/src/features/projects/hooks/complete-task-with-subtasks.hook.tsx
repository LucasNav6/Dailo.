import { useCallback } from "react";
import type { Task } from "@/models/task.model";
import { taskService } from "@/services/task.service";

export function useCompleteTaskWithSubtasks() {
  return useCallback(async (task: Task, subtasks: Task[], withSubtasks: boolean) => {
    if (withSubtasks) {
      for (const sub of subtasks) if (sub.status === "active") await taskService.update(sub.id, { status: "completed" });
    }
    await taskService.update(task.id, { status: "completed" });
  }, []);
}
