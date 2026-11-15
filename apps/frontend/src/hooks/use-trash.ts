import { useLiveQuery } from "dexie-react-hooks"
import { taskService } from "@/services/task.service"

/** Tareas descartadas (recuperables). */
export function useTrash() {
  const tasks = useLiveQuery(() => taskService.findDiscarded())
  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    restore: taskService.restore,
  }
}
