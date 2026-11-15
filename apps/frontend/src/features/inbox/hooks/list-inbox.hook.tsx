import { useLiveQuery } from "dexie-react-hooks"
import { taskService } from "@/services/task.service"

export function useInbox() {
  const tasks = useLiveQuery(() => taskService.findInbox())

  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    updateTask: taskService.update,
    decide: taskService.decide,
  }
}
