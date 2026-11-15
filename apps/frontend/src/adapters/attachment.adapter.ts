import type { Attachment } from "@/models/attachment.model"
import { db } from "./database"

export const attachmentAdapter = {
  create: (attachment: Attachment) => db.attachments.add(attachment),
  findByTaskId: (taskId: string) =>
    db.attachments.where("taskId").equals(taskId).toArray(),
  remove: (id: string) => db.attachments.delete(id),
  removeByTaskIds: (taskIds: string[]) =>
    db.attachments.where("taskId").anyOf(taskIds).delete(),
}
