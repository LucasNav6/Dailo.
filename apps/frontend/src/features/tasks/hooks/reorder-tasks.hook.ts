import { useCallback } from "react"
import { useUpdateTask } from "./update-task.hook"

export function useReorderTasks() {
  const update = useUpdateTask()
  return useCallback(
    async (orderedIds: string[], sectionId: string | undefined, movedId: string) => {
      for (const [position, id] of orderedIds.entries()) {
        const result = await update(id, id === movedId ? { position, sectionId } : { position })
        if (!result.ok) return result
      }
    },
    [update]
  )
}
