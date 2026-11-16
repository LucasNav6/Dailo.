import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { removeTasksService } from "../services/remove-tasks.service"
import { attachmentsCache, tasksCache } from "./task.cache"

export async function removeTasksAdapter(ids: string[]): Promise<Result<void>> {
  const result = await guard(() => removeTasksService(ids), "No se pudo eliminar la tarea.")
  if (result.ok) {
    tasksCache.clear()
    attachmentsCache.clear()
  }
  return result
}
