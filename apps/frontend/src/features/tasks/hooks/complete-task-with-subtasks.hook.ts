import { useCallback } from "react"
import { failure, success } from "@/shared/libs/result"
import type { Task } from "@/shared/models/task.model"
import { useUpdateTask } from "./update-task.hook"

export function useCompleteTaskWithSubtasks() {
  const update = useUpdateTask()
  return useCallback(
    async (task: Task, subtasks: Task[], withSubtasks: boolean) => {
      if (withSubtasks) {
        for (const sub of subtasks) {
          if (sub.status !== "active") continue
          const result = await update(sub.id, { status: "completed" })
          if (!result.ok) return failure(result.error)
        }
      }
      const result = await update(task.id, { status: "completed" })
      return result.ok ? success(undefined) : failure(result.error)
    },
    [update]
  )
}
