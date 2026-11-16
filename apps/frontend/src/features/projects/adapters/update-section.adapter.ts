import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Section, SectionChanges } from "@/shared/models/section.model"
import { updateSectionService } from "../services/update-section.service"
import { sectionsCache } from "./projects.cache"

export async function updateSectionAdapter(current: Section, changes: SectionChanges): Promise<Result<Section>> {
  const stamped = {
    ...changes,
    ...(changes.name === undefined ? {} : { name: changes.name.trim() }),
    updatedAt: new Date().toISOString(),
  }
  const result = await guard(() => updateSectionService(current.id, stamped), "No se pudo actualizar la sección.")
  if (!result.ok) return result
  sectionsCache.clear()
  return { ok: true, data: { ...current, ...stamped } }
}
