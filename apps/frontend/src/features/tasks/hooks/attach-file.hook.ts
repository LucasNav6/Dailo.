import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure, success } from "@/shared/libs/result"
import { MAX_ATTACHMENT_SIZE } from "@/shared/models/attachment.model"
import { addAttachmentAdapter } from "../adapters/add-attachment.adapter"
import { refreshAttachments } from "./list-attachments.hook"

export function useAttachFiles() {
  const notify = useNotify()
  return useCallback(
    async (taskId: string, files: File[]) => {
      for (const file of files) {
        if (file.size > MAX_ATTACHMENT_SIZE) return failure(`“${file.name}” supera los 10 MB.`)
        const result = await addAttachmentAdapter(taskId, file)
        if (!result.ok) {
          notify(result.error)
          await refreshAttachments(taskId)
          return failure(result.error)
        }
      }
      await refreshAttachments(taskId)
      return success(undefined)
    },
    [notify]
  )
}
