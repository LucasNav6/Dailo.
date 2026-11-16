import { db } from "@/shared/services/database"
import type { Attachment } from "@/shared/models/attachment.model"

export const addAttachmentService = async (record: Attachment) => {
  await db.attachments.add(record)
  return record
}
