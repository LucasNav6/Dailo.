import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Attachment } from "@/shared/models/attachment.model"
import { listAttachmentsService } from "../services/list-attachments.service"
import { attachmentsCache } from "./task.cache"

export async function listAttachmentsAdapter(taskId: string): Promise<Result<Attachment[]>> {
  const cached = attachmentsCache.get(taskId)
  if (cached) return success(cached)
  const result = await guard(async () => {
    const records = await listAttachmentsService(taskId)
    return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, "No se pudieron cargar los adjuntos.")
  if (result.ok) attachmentsCache.set(taskId, result.data)
  return result
}
