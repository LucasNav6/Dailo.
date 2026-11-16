import { useCallback } from "react"
import type { TimeOfDay } from "@/shared/models/task.model"
import { useUpdateTask } from "./update-task.hook"

export function useSetTaskPlan() {
  const update = useUpdateTask()
  return useCallback(
    (id: string, plannedDate: string | undefined, timeOfDay?: TimeOfDay) =>
      update(
        id,
        plannedDate ? { plannedDate, timeOfDay } : { plannedDate: undefined, timeOfDay: undefined, essential: false }
      ),
    [update]
  )
}
