import { useCallback } from "react";
import type { TimeOfDay } from "@/models/task.model";
import { taskService } from "@/services/task.service";

export function useSetTaskPlan() {
  return useCallback(async (id: string, plannedDate: string | undefined, timeOfDay?: TimeOfDay) => {
    await taskService.update(
      id,
      plannedDate ? { plannedDate, timeOfDay } : { plannedDate: undefined, timeOfDay: undefined, essential: false }
    );
  }, []);
}
