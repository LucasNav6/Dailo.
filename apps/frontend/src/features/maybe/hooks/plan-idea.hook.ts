import { useCallback } from "react"
import { useUpdateTask } from "@/features/tasks"
import { toISODate } from "@/shared/libs/dates"

export function usePlanIdea() {
  const update = useUpdateTask()
  return useCallback((id: string, date: Date = new Date()) => update(id, { status: "active", plannedDate: toISODate(date) }), [update])
}
