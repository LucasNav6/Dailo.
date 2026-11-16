import { db } from "@/shared/services/database"
import type { Task } from "@/shared/models/task.model"

export const addTaskService = async (record: Task) => {
  await db.tasks.add(record)
  return record
}
