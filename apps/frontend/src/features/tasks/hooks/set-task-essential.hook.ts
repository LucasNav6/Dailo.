import { useCallback } from "react"
import { loadPreferences } from "@/features/settings"
import { failure } from "@/shared/libs/result"
import { useTasksStore } from "../store/tasks.store"
import { useUpdateTask } from "./update-task.hook"

export function useSetTaskEssential() {
  const update = useUpdateTask()
  return useCallback(
    async (id: string, essential: boolean) => {
      if (essential) {
        const { tasks } = useTasksStore.getState()
        const task = tasks.find((candidate) => candidate.id === id)
        if (!task?.plannedDate) return failure("Planificá la tarea primero.")
        const { maxEssentialTasks } = await loadPreferences()
        const sameDay = tasks.filter(
          (other) =>
            other.id !== id &&
            other.essential &&
            other.plannedDate === task.plannedDate &&
            other.status !== "discarded"
        )
        if (sameDay.length >= maxEssentialTasks) return failure(`Ya tenés ${maxEssentialTasks} esenciales ese día.`)
      }
      return update(id, { essential })
    },
    [update]
  )
}
