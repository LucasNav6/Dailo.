import { useCallback } from "react"
import { getTasks, useDeleteTasks, useUpdateTask } from "@/features/tasks"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { removeProjectAdapter } from "../adapters/remove-project.adapter"
import { removeSectionsAdapter } from "../adapters/remove-sections.adapter"
import { getSections } from "./list-sections.hook"
import { useProjectsStore } from "../store/projects.store"
import { useSectionsStore } from "../store/sections.store"

export function useDeleteProject() {
  const notify = useNotify()
  const update = useUpdateTask()
  const deleteTasks = useDeleteTasks()
  return useCallback(
    async (id: string, moveToInbox: boolean): Promise<Result<void>> => {
      if (moveToInbox) {
        const own = getTasks().filter((task) => task.projectId === id)
        for (const task of own) {
          if (task.status !== "active" && task.status !== "someday") continue
          const result = await update(
            task.id,
            task.parentId
              ? { projectId: undefined, sectionId: undefined }
              : { status: "inbox", projectId: undefined, sectionId: undefined, plannedDate: undefined, timeOfDay: undefined }
          )
          if (!result.ok) return failure(result.error)
        }
      }
      const remaining = getTasks().filter((task) => task.projectId === id && !task.parentId).map((task) => task.id)
      const removedTasks = await deleteTasks(remaining)
      if (!removedTasks.ok) return removedTasks
      const sectionIds = getSections().filter((section) => section.projectId === id).map((section) => section.id)
      const removedSections = await removeSectionsAdapter(sectionIds)
      if (!removedSections.ok) {
        notify(removedSections.error)
        return removedSections
      }
      useSectionsStore.getState().removeMany(sectionIds)
      const removed = await removeProjectAdapter(id)
      if (!removed.ok) {
        notify(removed.error)
        return removed
      }
      useProjectsStore.getState().remove(id)
      return success(undefined)
    },
    [deleteTasks, notify, update]
  )
}
