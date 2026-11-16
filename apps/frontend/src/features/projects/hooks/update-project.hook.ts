import { useCallback } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { failure } from "@/shared/libs/result"
import type { Project } from "@/shared/models/project.model"
import type { Result } from "@/shared/models/result.model"
import { updateProjectAdapter } from "../adapters/update-project.adapter"
import { DUPLICATE_PROJECT, isDuplicateName } from "../libs/name-rules"
import { useProjectsStore } from "../store/projects.store"

export function useUpdateProject() {
  const notify = useNotify()
  return useCallback(
    async (id: string, name: string, description: string): Promise<Result<Project>> => {
      const { projects, upsert } = useProjectsStore.getState()
      const current = projects.find((project) => project.id === id)
      if (!current) return failure("El proyecto ya no existe.")
      if (!name.trim()) return failure("El nombre es obligatorio.")
      if (isDuplicateName(projects, name, id)) return failure(DUPLICATE_PROJECT)
      const result = await updateProjectAdapter(current, { name, description: description || undefined })
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
