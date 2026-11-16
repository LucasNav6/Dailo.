import { db } from "@/shared/services/database"
import type { Task } from "@/shared/models/task.model"

export const updateTaskService = (id: string, changes: Partial<Task>) => db.tasks.update(id, changes)
