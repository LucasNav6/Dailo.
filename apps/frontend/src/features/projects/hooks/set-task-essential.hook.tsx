import { useCallback } from "react";
import { settingService } from "@/services/setting.service";
import { taskService } from "@/services/task.service";

export function useSetTaskEssential() {
  return useCallback(async (id: string, essential: boolean) => {
    if (essential) {
      const task = await taskService.findById(id);
      if (!task?.plannedDate) return "Planificá la tarea primero.";
      const { maxEssentialTasks } = await settingService.getPreferences();
      const sameDay = (await taskService.findAll()).filter(
        (other) => other.id !== id && other.essential && other.plannedDate === task.plannedDate && other.status !== "discarded"
      );
      if (sameDay.length >= maxEssentialTasks) return `Ya tenés ${maxEssentialTasks} esenciales ese día.`;
    }
    await taskService.update(id, { essential });
  }, []);
}
