import { useCallback } from "react"
import { useUpdateTask } from "./update-task.hook"

export function useSetTaskDone() {
  const update = useUpdateTask()
  return useCallback((id: string, done: boolean) => update(id, { status: done ? "completed" : "active" }), [update])
}
