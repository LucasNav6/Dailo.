import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { removeAttachmentAdapter } from "../adapters/remove-attachment.adapter"
import { refreshAttachments } from "./list-attachments.hook"

export function useRemoveAttachment() {
  const notify = useNotify()
  return useCallback(
    async (taskId: string, id: string) => {
      const result = await removeAttachmentAdapter(id)
      if (!result.ok) {
        notify(result.error)
        return result
      }
      await refreshAttachments(taskId)
      return result
    },
    [notify]
  )
}
