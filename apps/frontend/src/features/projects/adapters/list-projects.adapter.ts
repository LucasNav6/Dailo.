import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Project } from "@/shared/models/project.model"
import { listProjectsService } from "../services/list-projects.service"
import { projectsCache } from "./projects.cache"

export async function listProjectsAdapter(): Promise<Result<Project[]>> {
  const cached = projectsCache.get("all")
  if (cached) return success(cached)
  const result = await guard(listProjectsService, "No se pudieron cargar los proyectos.")
  if (result.ok) projectsCache.set("all", result.data)
  return result
}
