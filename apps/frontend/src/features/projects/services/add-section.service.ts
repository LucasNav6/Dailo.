import { db } from "@/shared/services/database"
import type { Section } from "@/shared/models/section.model"

export const addSectionService = async (record: Section) => {
  await db.sections.add(record)
  return record
}
