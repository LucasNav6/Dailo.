import { useCallback } from "react";
import type { TimeOfDay } from "@/models/task.model";
import { taskService } from "@/services/task.service";

/** Planifica la tarea para un día (y franja opcional). Sin día se quita la planificación y deja de ser esencial. */
export function useSetTaskPlan() {
  return useCallback(async (id: string, plannedDate: string | undefined, timeOfDay?: TimeOfDay) => {
    await taskService.update(
      id,
      plannedDate ? { plannedDate, timeOfDay } : { plannedDate: undefined, timeOfDay: undefined, essential: false }
    );
  }, []);
}
