import { useState } from "react"
import { useOutletContext } from "react-router"
import type { AppOutletContext } from "@/shared/components/layouts/app-shell"
import { formatAge } from "@/shared/libs/age"
import { useInbox } from "./list-inbox.hook"

export function useInboxPage() {
  const { tasks, isLoading, hasError, reload } = useInbox()
  const { openCapture } = useOutletContext<AppOutletContext>()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return {
    isLoading,
    hasError,
    reload,
    openCapture,
    count: tasks.length,
    entries: tasks.map((task) => ({ id: task.id, title: task.title, age: formatAge(task.createdAt) })),
    selected: tasks.find((task) => task.id === selectedId) ?? null,
    open: (index: number) => setSelectedId(tasks[index].id),
    processFirst: () => setSelectedId(tasks[0].id),
    close: () => setSelectedId(null),
  }
}
