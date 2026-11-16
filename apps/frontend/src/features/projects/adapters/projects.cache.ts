import { createCache } from "@/shared/libs/cache"
import { registerReset } from "@/shared/libs/reset"
import type { Project } from "@/shared/models/project.model"
import type { Section } from "@/shared/models/section.model"

export const projectsCache = createCache<Project[]>()
export const sectionsCache = createCache<Section[]>()

registerReset(() => {
  projectsCache.clear()
  sectionsCache.clear()
})
