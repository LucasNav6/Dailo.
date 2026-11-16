import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Project, ProjectChanges } from "@/shared/models/project.model"
import { updateProjectService } from "../services/update-project.service"
import { projectsCache } from "./projects.cache"

export async function updateProjectAdapter(current: Project, changes: ProjectChanges): Promise<Result<Project>> {
  const stamped = {
    ...changes,
    ...(changes.name === undefined ? {} : { name: changes.name.trim() }),
    updatedAt: new Date().toISOString(),
  }
  const result = await guard(() => updateProjectService(current.id, stamped), "No se pudo actualizar el proyecto.")
  if (!result.ok) return result
  projectsCache.clear()
  return { ok: true, data: { ...current, ...stamped } }
}
