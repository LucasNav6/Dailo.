import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Section } from "@/shared/models/section.model"
import { updateSectionAdapter } from "../adapters/update-section.adapter"
import { DUPLICATE_SECTION, isDuplicateName } from "../libs/name-rules"
import { useSectionsStore } from "../store/sections.store"

export function useRenameSection() {
  const notify = useNotify()
  return useCallback(
    async (section: Section, name: string): Promise<Result<Section>> => {
      const { sections, upsert } = useSectionsStore.getState()
      if (!name.trim()) return failure("El nombre es obligatorio.")
      if (isDuplicateName(sections.filter((item) => item.projectId === section.projectId), name, section.id)) return failure(DUPLICATE_SECTION)
      const result = await updateSectionAdapter(section, { name })
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
