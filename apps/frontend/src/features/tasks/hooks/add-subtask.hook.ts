import { useCallback } from "react"
import type { Task } from "@/shared/models/task.model"
import { useCreateTask } from "./create-task.hook"

export function useAddSubtask() {
  const create = useCreateTask()
  return useCallback(
    (parent: Task, title: string) =>
      create({ title, parentId: parent.id, projectId: parent.projectId, status: "active" }),
    [create]
  )
}
