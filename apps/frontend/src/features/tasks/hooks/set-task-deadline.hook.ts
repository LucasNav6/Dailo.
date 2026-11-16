import { useCallback } from "react"
import { useUpdateTask } from "./update-task.hook"

export function useSetTaskDeadline() {
  const update = useUpdateTask()
  return useCallback((id: string, deadline: string | undefined) => update(id, { deadline }), [update])
}
