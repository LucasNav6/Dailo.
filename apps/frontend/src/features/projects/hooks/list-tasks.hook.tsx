import { useLiveQuery } from "dexie-react-hooks"
import type { TaskStatus } from "@/models/task.model"
import { taskService } from "@/services/task.service"

/** Tareas reactivas; con `status` solo las de ese estado. */
export function useTasks(status?: TaskStatus) {
  const tasks = useLiveQuery(
    () => (status ? taskService.findByStatus(status) : taskService.findAll()),
    [status]
  )

  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    createTask: taskService.create,
    updateTask: taskService.update,
    removeTask: taskService.remove,
  }
}
