import { useCallback } from "react"
import { useUpdateTask } from "@/features/tasks"
import { toISODate } from "@/shared/libs/dates"
import type { Task } from "@/shared/models/task.model"

export function useBringOverdueToToday() {
  const update = useUpdateTask()
  return useCallback(
    async (tasks: Task[], today: Date) => {
      for (const task of tasks) {
        const result = await update(task.id, { plannedDate: toISODate(today), timeOfDay: undefined })
        if (!result.ok) return result
      }
    },
    [update]
  )
}
