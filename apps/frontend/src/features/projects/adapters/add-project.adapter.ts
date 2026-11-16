import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Project, ProjectInput } from "@/shared/models/project.model"
import { addProjectService } from "../services/add-project.service"
import { projectsCache } from "./projects.cache"

export async function addProjectAdapter(input: ProjectInput): Promise<Result<Project>> {
  const now = new Date().toISOString()
  const record: Project = {
    position: Date.now(),
    ...input,
    name: input.name.trim(),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const result = await guard(() => addProjectService(record), "No se pudo crear el proyecto.")
  if (result.ok) projectsCache.clear()
  return result
}
