import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import { removeSectionsService } from "../services/remove-sections.service"
import { sectionsCache } from "./projects.cache"

export async function removeSectionsAdapter(ids: string[]): Promise<Result<void>> {
  const result = await guard(() => removeSectionsService(ids), "No se pudo eliminar la sección.")
  if (result.ok) sectionsCache.clear()
  return result
}
