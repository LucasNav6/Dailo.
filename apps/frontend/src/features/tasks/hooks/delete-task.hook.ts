import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import type { Result } from "@/shared/models/result.model"
import { removeTasksAdapter } from "../adapters/remove-tasks.adapter"
import { descendantIds } from "../libs/task-rules"
import { useTasksStore } from "../store/tasks.store"

export function useDeleteTasks() {
  const notify = useNotify()
  return useCallback(
    async (rootIds: string[]): Promise<Result<void>> => {
      const { tasks, removeMany } = useTasksStore.getState()
      const ids = descendantIds(rootIds, tasks)
      const result = await removeTasksAdapter(ids)
      if (!result.ok) {
        notify(result.error)
        return result
      }
      removeMany(ids)
      return result
    },
    [notify]
  )
}

export function useDeleteTask() {
  const deleteTasks = useDeleteTasks()
  return useCallback((id: string) => deleteTasks([id]), [deleteTasks])
}
