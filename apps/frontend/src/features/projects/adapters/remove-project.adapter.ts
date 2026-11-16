import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { removeProjectService } from "../services/remove-project.service"
import { projectsCache } from "./projects.cache"

export async function removeProjectAdapter(id: string): Promise<Result<void>> {
  const result = await guard(async () => {
    await removeProjectService(id)
  }, "No se pudo eliminar el proyecto.")
  if (result.ok) projectsCache.clear()
  return result
}
