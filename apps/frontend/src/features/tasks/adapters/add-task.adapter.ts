import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Task, TaskInput } from "@/shared/models/task.model"
import { addTaskService } from "../services/add-task.service"
import { tasksCache } from "./task.cache"

export async function addTaskAdapter(input: TaskInput): Promise<Result<Task>> {
  const now = new Date().toISOString()
  const record: Task = {
    status: "inbox",
    essential: false,
    position: Date.now(),
    ...input,
    title: input.title.trim(),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const result = await guard(() => addTaskService(record), "No se pudo guardar la tarea.")
  if (result.ok) tasksCache.clear()
  return result
}
