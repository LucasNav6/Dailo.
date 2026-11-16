import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Section, SectionInput } from "@/shared/models/section.model"
import { addSectionService } from "../services/add-section.service"
import { sectionsCache } from "./projects.cache"

export async function addSectionAdapter(input: SectionInput): Promise<Result<Section>> {
  const now = new Date().toISOString()
  const record: Section = {
    position: Date.now(),
    ...input,
    name: input.name.trim(),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const result = await guard(() => addSectionService(record), "No se pudo crear la sección.")
  if (result.ok) sectionsCache.clear()
  return result
}
