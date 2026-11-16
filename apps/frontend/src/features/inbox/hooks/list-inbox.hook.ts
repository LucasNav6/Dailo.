import { useTasks } from "@/features/tasks"

export function useInbox() {
  const { tasks, isLoading, hasError, reload } = useTasks()
  const inbox = tasks
    .filter((task) => task.status === "inbox")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.position - a.position)
  return { tasks: inbox, isLoading, hasError, reload }
}
