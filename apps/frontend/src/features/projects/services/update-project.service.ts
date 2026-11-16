import { db } from "@/shared/services/database"
import type { Project } from "@/shared/models/project.model"

export const updateProjectService = (id: string, changes: Partial<Project>) => db.projects.update(id, changes)
