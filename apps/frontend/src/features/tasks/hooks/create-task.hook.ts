import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Task, TaskInput } from "@/shared/models/task.model"
import { addTaskAdapter } from "../adapters/add-task.adapter"
import { validateTask } from "../libs/task-rules"
import { useTasksStore } from "../store/tasks.store"

export function useCreateTask() {
  const notify = useNotify()
  return useCallback(
    async (input: TaskInput): Promise<Result<Task>> => {
      const { tasks, upsert } = useTasksStore.getState()
      const invalid = validateTask(input, tasks)
      if (invalid) return failure(invalid)
      const result = await addTaskAdapter(input)
      if (!result.ok) {
        notify(result.error)
        return result
      }
      upsert(result.data)
      return result
    },
    [notify]
  )
}
