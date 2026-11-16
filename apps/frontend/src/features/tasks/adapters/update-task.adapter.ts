import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Task } from "@/shared/models/task.model"
import { updateTaskService } from "../services/update-task.service"
import { tasksCache } from "./task.cache"

export async function updateTaskAdapter(current: Task, changes: Partial<Task>): Promise<Result<Task>> {
  const stamped = { ...changes, updatedAt: new Date().toISOString() }
  const result = await guard(() => updateTaskService(current.id, stamped), "No se pudo actualizar la tarea.")
  if (!result.ok) return result
  tasksCache.clear()
  return { ok: true, data: { ...current, ...stamped } }
}
