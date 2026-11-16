import { db } from "@/shared/services/database"
import type { Project } from "@/shared/models/project.model"

export const addProjectService = async (record: Project) => {
  await db.projects.add(record)
  return record
}
