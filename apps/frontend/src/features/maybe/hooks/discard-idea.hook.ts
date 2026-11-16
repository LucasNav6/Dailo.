import { useCallback } from "react"
import { useUpdateTask } from "@/features/tasks"

export function useDiscardIdea() {
  const update = useUpdateTask()
  return useCallback((id: string) => update(id, { status: "discarded" }), [update])
}
