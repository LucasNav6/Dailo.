import { useEffect } from "react"
import { listAttachmentsAdapter } from "../adapters/list-attachments.adapter"
import { useAttachmentsStore } from "../store/attachments.store"

export async function refreshAttachments(taskId: string) {
  const result = await listAttachmentsAdapter(taskId)
  if (result.ok) useAttachmentsStore.getState().set(taskId, result.data)
}

export function useAttachments(taskId: string) {
  const attachments = useAttachmentsStore((state) => state.byTask[taskId])

  useEffect(() => {
    if (taskId) void refreshAttachments(taskId)
  }, [taskId])

  return attachments ?? []
}
