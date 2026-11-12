import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import type {
  Section,
  SectionChanges,
  SectionInput,
} from "@/models/section.model"

function cleanName(name: string) {
  const value = name.trim()
  if (!value) throw new Error("Section name is required")
  return value
}

export const sectionService = {
  create: (input: SectionInput) =>
    atomically(async () => {
      if (!(await projectAdapter.findById(input.projectId)))
        throw new Error(`Project not found: ${input.projectId}`)
      const now = new Date().toISOString()
      const section: Section = {
        position: Date.now(),
        ...input,
        name: cleanName(input.name),
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      }
      await sectionAdapter.create(section)
      return section
    }),

  update: (id: string, changes: SectionChanges) =>
    atomically(async () => {
      const current = await sectionAdapter.findById(id)
      if (!current) throw new Error(`Section not found: ${id}`)
      const next: Section = {
        ...current,
        ...changes,
        name: changes.name === undefined ? current.name : cleanName(changes.name),
        updatedAt: new Date().toISOString(),
      }
      await sectionAdapter.update(id, next)
      return next
    }),

  /** Elimina la sección; sus tareas quedan en el proyecto sin sección. */
  remove: (id: string) =>
    atomically(async () => {
      await taskAdapter.clearSection(id, new Date().toISOString())
      await sectionAdapter.remove(id)
    }),

  findById: (id: string) => sectionAdapter.findById(id),
  findByProjectId: (projectId: string) =>
    sectionAdapter.findByProjectId(projectId),
}
