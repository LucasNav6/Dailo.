import { useCallback } from "react";
import type { Task } from "@/models/task.model";
import { toISODate } from "@/lib/dates";
import { taskService } from "@/services/task.service";

export function useBringOverdueToToday() {
  return useCallback(async (tasks: Task[], today: Date) => {
    for (const task of tasks) await taskService.update(task.id, { plannedDate: toISODate(today), timeOfDay: undefined });
  }, []);
}
