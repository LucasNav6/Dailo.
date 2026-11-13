import { useLiveQuery } from "dexie-react-hooks"
import { taskService } from "@/services/task.service"

/** Inbox reactivo (capturas más recientes primero) y sus acciones. */
export function useInbox() {
  const tasks = useLiveQuery(() => taskService.findInbox())

  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    capture: (title: string) => taskService.create({ title }),
    decide: taskService.decide,
    plan: taskService.plan,
    discard: taskService.discard,
    restore: taskService.restore,
  }
}
