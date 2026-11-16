import { useEffect } from "react"
import { listTasksAdapter } from "../adapters/list-tasks.adapter"
import { useTasksStore } from "../store/tasks.store"

export async function loadTasks() {
  const store = useTasksStore.getState()
  if (store.status === "loading") return
  store.start()
  const result = await listTasksAdapter()
  if (result.ok) useTasksStore.getState().ready(result.data)
  else useTasksStore.getState().fail()
}

export function useTasks() {
  const tasks = useTasksStore((state) => state.tasks)
  const status = useTasksStore((state) => state.status)

  useEffect(() => {
    if (status === "idle") void loadTasks()
  }, [status])

  return {
    tasks,
    isLoading: status === "idle" || status === "loading",
    hasError: status === "error",
    reload: loadTasks,
  }
}

export const getTasks = () => useTasksStore.getState().tasks
