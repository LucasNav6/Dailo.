import { useLiveQuery } from "dexie-react-hooks"
import { taskService } from "@/services/task.service"

/** Ideas de Tal vez (las movidas más recientemente primero) y sus acciones. */
export function useSomeday() {
  const tasks = useLiveQuery(() => taskService.findSomeday())
  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    plan: taskService.plan,
    discard: taskService.discard,
    restore: taskService.restore,
  }
}
