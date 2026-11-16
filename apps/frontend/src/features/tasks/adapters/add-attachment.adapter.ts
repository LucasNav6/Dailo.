import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Attachment } from "@/shared/models/attachment.model"
import { addAttachmentService } from "../services/add-attachment.service"
import { attachmentsCache } from "./task.cache"

export async function addAttachmentAdapter(taskId: string, file: File): Promise<Result<Attachment>> {
  const record: Attachment = {
    id: crypto.randomUUID(),
    taskId,
    name: file.name,
    type: file.type,
    size: file.size,
    data: file,
    createdAt: new Date().toISOString(),
  }
  const result = await guard(() => addAttachmentService(record), `No se pudo guardar “${file.name}”.`)
  if (result.ok) attachmentsCache.clear()
  return result
}
