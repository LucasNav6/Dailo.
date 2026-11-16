import { db } from "@/shared/services/database"

export const removeTasksService = (ids: string[]) =>
  db.transaction("rw", db.tasks, db.attachments, async () => {
    await db.attachments.where("taskId").anyOf(ids).delete()
    await db.tasks.bulkDelete(ids)
  })
