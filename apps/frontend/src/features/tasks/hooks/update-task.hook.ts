import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Task, TaskChanges } from "@/shared/models/task.model"
import { updateTaskAdapter } from "../adapters/update-task.adapter"
import { validateTask, withStatusStamps } from "../libs/task-rules"
import { useTasksStore } from "../store/tasks.store"

export function useUpdateTask() {
  const notify = useNotify()
  return useCallback(
    async (id: string, changes: TaskChanges): Promise<Result<Task>> => {
      const { tasks, upsert } = useTasksStore.getState()
      const current = tasks.find((task) => task.id === id)
      if (!current) return failure("La tarea ya no existe.")
      const normalized = changes.title === undefined ? changes : { ...changes, title: changes.title.trim() }
      const stamped = withStatusStamps(current, normalized, new Date().toISOString())
      const invalid = validateTask({ ...current, ...stamped }, tasks)
      if (invalid) return failure(invalid)
      const result = await updateTaskAdapter(current, stamped)
      if (!result.ok) {
        notify(result.error)
        return result
      }
      upsert(result.data)
      return result
    },
    [notify]
  )
}
