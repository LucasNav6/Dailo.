import { useCallback } from "react";
import { toISODate } from "@/lib/dates";
import { taskService } from "@/services/task.service";

/** Planifica una idea de Tal vez: pasa a activa y queda para hoy (o la fecha dada). */
export function usePlanIdea() {
  return useCallback(async (id: string, date: Date = new Date()) => {
    await taskService.update(id, { status: "active", plannedDate: toISODate(date) });
  }, []);
}
