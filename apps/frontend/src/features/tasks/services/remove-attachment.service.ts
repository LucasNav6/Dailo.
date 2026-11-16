import { db } from "@/shared/services/database"

export const removeAttachmentService = (id: string) => db.attachments.delete(id)
