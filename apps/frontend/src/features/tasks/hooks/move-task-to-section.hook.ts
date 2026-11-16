import { useCallback } from "react"
import { useUpdateTask } from "./update-task.hook"

export function useMoveTaskToSection() {
  const update = useUpdateTask()
  return useCallback((taskId: string, sectionId: string | undefined) => update(taskId, { sectionId }), [update])
}
