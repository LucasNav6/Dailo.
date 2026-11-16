import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { removeAttachmentService } from "../services/remove-attachment.service"
import { attachmentsCache } from "./task.cache"

export async function removeAttachmentAdapter(id: string): Promise<Result<void>> {
  const result = await guard(() => removeAttachmentService(id), "No se pudo quitar el adjunto.")
  if (result.ok) attachmentsCache.clear()
  return result
}
