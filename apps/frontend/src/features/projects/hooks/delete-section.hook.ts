import { useCallback } from "react"
import { getTasks, isVisible, useDeleteTasks, useMoveTaskToSection } from "@/features/tasks"
import { useNotify } from "@/shared/hooks/toast.hook"
import type { Result } from "@/shared/models/result.model"
import { failure } from "@/shared/libs/result"
import { removeSectionsAdapter } from "../adapters/remove-sections.adapter"
import { useSectionsStore } from "../store/sections.store"

export type DeleteSectionMode = "keep" | "delete-tasks"

export function useDeleteSection() {
  const notify = useNotify()
  const deleteTasks = useDeleteTasks()
  const moveToSection = useMoveTaskToSection()
  return useCallback(
    async (sectionId: string, mode: DeleteSectionMode): Promise<Result<void>> => {
      const inSection = getTasks().filter((task) => task.sectionId === sectionId)
      if (mode === "delete-tasks") {
        const removed = await deleteTasks(inSection.filter((task) => !task.parentId && isVisible(task.status)).map((task) => task.id))
        if (!removed.ok) return removed
      }
      for (const task of inSection) {
        if (mode === "delete-tasks" && !getTasks().some((candidate) => candidate.id === task.id)) continue
        const moved = await moveToSection(task.id, undefined)
        if (!moved.ok) return failure(moved.error)
      }
      const result = await removeSectionsAdapter([sectionId])
      if (!result.ok) {
        notify(result.error)
        return result
      }
      useSectionsStore.getState().removeMany([sectionId])
      return result
    },
    [deleteTasks, moveToSection, notify]
  )
}
