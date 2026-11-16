import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Section } from "@/shared/models/section.model"
import { listSectionsService } from "../services/list-sections.service"
import { sectionsCache } from "./projects.cache"

export async function listSectionsAdapter(): Promise<Result<Section[]>> {
  const cached = sectionsCache.get("all")
  if (cached) return success(cached)
  const result = await guard(listSectionsService, "No se pudieron cargar las secciones.")
  if (result.ok) sectionsCache.set("all", result.data)
  return result
}
