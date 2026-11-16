import { useCallback } from "react"
import { getTasks, useUpdateTask } from "@/features/tasks"
import { failure } from "@/shared/libs/result"
import { decisionChanges, type InboxDecision } from "../libs/inbox-decisions"

export function useProcessItem() {
  const update = useUpdateTask()
  return useCallback(
    async (id: string, decision: InboxDecision, edits: { title?: string; description?: string } = {}) => {
      const current = getTasks().find((task) => task.id === id)
      if (!current) return failure("La tarea ya no existe.")
      if (current.status !== "inbox") return failure("La tarea ya no está en el inbox.")
      return update(id, { ...edits, ...decisionChanges(decision) })
    },
    [update]
  )
}
