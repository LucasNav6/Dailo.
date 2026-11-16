import { db } from "@/shared/services/database"
import type { Section } from "@/shared/models/section.model"

export const updateSectionService = (id: string, changes: Partial<Section>) => db.sections.update(id, changes)
