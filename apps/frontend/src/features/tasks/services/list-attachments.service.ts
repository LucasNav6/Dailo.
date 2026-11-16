import { db } from "@/shared/services/database"

export const listAttachmentsService = (taskId: string) =>
  db.attachments.where("taskId").equals(taskId).toArray()
