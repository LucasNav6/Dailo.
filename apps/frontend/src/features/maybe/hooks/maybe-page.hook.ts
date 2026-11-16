import { useOutletContext } from "react-router"
import { useTasks } from "@/features/tasks"
import type { AppOutletContext } from "@/shared/components/layouts/app-shell"
import { formatAge } from "@/shared/libs/age"
import { useDiscardIdea } from "./discard-idea.hook"
import { usePlanIdea } from "./plan-idea.hook"

export function useMaybePage() {
  const { tasks, isLoading, hasError, reload } = useTasks()
  const planIdea = usePlanIdea()
  const discardIdea = useDiscardIdea()
  const { openCapture } = useOutletContext<AppOutletContext>()

  const ideas = tasks
    .filter((task) => task.status === "someday")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((task) => ({ id: task.id, title: task.title, note: task.description ?? "", age: formatAge(task.createdAt) }))

  return {
    isLoading,
    hasError,
    reload,
    ideas,
    openCapture,
    eyebrow: `Tal vez · ${ideas.length === 1 ? "1 idea" : ideas.length === 0 ? "0" : `${ideas.length} ideas`}`,
    plan: (id: string) => void planIdea(id),
    discard: (id: string) => void discardIdea(id),
  }
}
