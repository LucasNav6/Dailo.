import { attachmentAdapter } from "@/adapters/attachment.adapter"
import { MAX_ATTACHMENT_SIZE, type Attachment } from "@/models/attachment.model"

export const attachmentService = {
  add: async (taskId: string, file: File) => {
    if (file.size > MAX_ATTACHMENT_SIZE) throw new Error("File too large")
    const attachment: Attachment = {
      id: crypto.randomUUID(),
      taskId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: file,
      createdAt: new Date().toISOString(),
    }
    await attachmentAdapter.create(attachment)
    return attachment
  },
  remove: (id: string) => attachmentAdapter.remove(id),
  findByTaskId: async (taskId: string) =>
    (await attachmentAdapter.findByTaskId(taskId)).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    ),
}
