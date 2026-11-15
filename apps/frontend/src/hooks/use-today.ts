import { useLiveQuery } from "dexie-react-hooks"
import { format } from "date-fns"
import { taskService } from "@/services/task.service"

/** Tareas del día de hoy (YYYY-MM-DD local) y sus acciones. */
export function useToday() {
  const date = format(new Date(), "yyyy-MM-dd")
  const tasks = useLiveQuery(() => taskService.findForDay(date), [date])
  return {
    date,
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    setCompleted: taskService.setCompleted,
    setTimeOfDay: taskService.setTimeOfDay,
  }
}
