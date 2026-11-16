import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Task } from "@/shared/models/task.model"
import { listTasksService } from "../services/list-tasks.service"
import { tasksCache } from "./task.cache"

export async function listTasksAdapter(): Promise<Result<Task[]>> {
  const cached = tasksCache.get("all")
  if (cached) return success(cached)
  const result = await guard(listTasksService, "No se pudieron cargar las tareas.")
  if (result.ok) tasksCache.set("all", result.data)
  return result
}
