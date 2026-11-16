import { useTasks } from "./list-tasks.hook"

export function useTask(id: string) {
  const { tasks, isLoading, hasError } = useTasks()
  const task = tasks.find((candidate) => candidate.id === id) ?? null
  return { task, isLoading, hasError }
}
