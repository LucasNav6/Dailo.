import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { updateSectionAdapter } from "../adapters/update-section.adapter"
import { useSectionsStore } from "../store/sections.store"

export function useReorderSections() {
  const notify = useNotify()
  return useCallback(
    async (orderedIds: string[]) => {
      for (const [position, id] of orderedIds.entries()) {
        const { sections, upsert } = useSectionsStore.getState()
        const current = sections.find((section) => section.id === id)
        if (!current) continue
        const result = await updateSectionAdapter(current, { position })
        if (!result.ok) {
          notify(result.error)
          return
        }
        upsert(result.data)
      }
    },
    [notify]
  )
}
