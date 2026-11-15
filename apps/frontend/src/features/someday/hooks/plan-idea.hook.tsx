import { useCallback } from "react";
import { toISODate } from "@/lib/dates";
import { taskService } from "@/services/task.service";

export function usePlanIdea() {
  return useCallback(async (id: string, date: Date = new Date()) => {
    await taskService.update(id, { status: "active", plannedDate: toISODate(date) });
  }, []);
}
