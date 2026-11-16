import { useCallback } from "react"
import { useUpdateTask } from "@/features/tasks"

export function useEditItem() {
  const update = useUpdateTask()
  return useCallback((id: string, edits: { title?: string; description?: string }) => update(id, edits), [update])
}
