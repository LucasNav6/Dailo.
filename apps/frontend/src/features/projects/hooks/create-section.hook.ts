import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Section } from "@/shared/models/section.model"
import { addSectionAdapter } from "../adapters/add-section.adapter"
import { DUPLICATE_SECTION, isDuplicateName } from "../libs/name-rules"
import { useSectionsStore } from "../store/sections.store"

export function useCreateSection(projectId: string) {
  const notify = useNotify()
  return useCallback(
    async (name: string): Promise<Result<Section>> => {
      const { sections, upsert } = useSectionsStore.getState()
      if (!name.trim()) return failure("El nombre es obligatorio.")
      if (isDuplicateName(sections.filter((section) => section.projectId === projectId), name)) return failure(DUPLICATE_SECTION)
      const result = await addSectionAdapter({ projectId, name })
      if (!result.ok) {
        notify(result.error)
        return result
      }
      upsert(result.data)
      return result
    },
    [notify, projectId]
  )
}
