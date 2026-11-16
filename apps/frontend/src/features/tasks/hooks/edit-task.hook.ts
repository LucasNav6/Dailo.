import { useCallback } from "react"
import { useUpdateTask } from "./update-task.hook"

export function useEditTask() {
  const update = useUpdateTask()
  return useCallback(
    (id: string, edits: { title?: string; description?: string }) =>
      update(id, { ...edits, description: edits.description?.trim() ? edits.description.trim() : undefined }),
    [update]
  )
}
