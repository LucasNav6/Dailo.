import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import { ValidationError } from "./errors"
import type {
  Section,
  SectionChanges,
  SectionInput,
} from "@/models/section.model"

const sortByPosition = <T extends { position: number; createdAt: string }>(
  items: T[]
) =>
  [...items].sort(
    (a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt)
  )

function cleanName(name: string) {
  const value = name.trim()
  if (!value) throw new ValidationError("Section name is required")
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

  /** Sube o baja una sección entre las de su proyecto. */
  move: (id: string, direction: "up" | "down") =>
    atomically(async () => {
      const section = await sectionAdapter.findById(id)
      if (!section) throw new Error(`Section not found: ${id}`)
      const siblings = sortByPosition(
        await sectionAdapter.findByProjectId(section.projectId)
      )
      const from = siblings.findIndex((item) => item.id === id)
      const to = direction === "up" ? from - 1 : from + 1
      if (to < 0 || to >= siblings.length) return
      ;[siblings[from], siblings[to]] = [siblings[to], siblings[from]]
      // Renumera para que el orden sea estable aunque haya posiciones iguales.
      const now = new Date().toISOString()
      for (const [position, item] of siblings.entries())
        if (item.position !== position)
          await sectionAdapter.update(item.id, { position, updatedAt: now })
    }),

  findById: (id: string) => sectionAdapter.findById(id),
  findByProjectId: async (projectId: string) =>
    sortByPosition(await sectionAdapter.findByProjectId(projectId)),
}
