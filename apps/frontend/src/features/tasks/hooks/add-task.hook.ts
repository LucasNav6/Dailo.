import { useCallback } from "react"
import { useCreateTask } from "./create-task.hook"

export function useAddTask(projectId: string) {
  const create = useCreateTask()
  return useCallback(
    (title: string, description: string, sectionId?: string) =>
      create({ title, description: description || undefined, projectId, sectionId, status: "active" }),
    [create, projectId]
  )
}
