import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import type {
  Project,
  ProjectChanges,
  ProjectInput,
} from "@/models/project.model"
import { removeTaskTrees } from "./task.service"

function cleanName(name: string) {
  const value = name.trim()
  if (!value) throw new Error("Project name is required")
  return value
}

export const projectService = {
  create: async (input: ProjectInput) => {
    const now = new Date().toISOString()
    const project: Project = {
      position: Date.now(),
      ...input,
      name: cleanName(input.name),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    await projectAdapter.create(project)
    return project
  },

  update: (id: string, changes: ProjectChanges) =>
    atomically(async () => {
      const current = await projectAdapter.findById(id)
      if (!current) throw new Error(`Project not found: ${id}`)
      const next: Project = {
        ...current,
        ...changes,
        name: changes.name === undefined ? current.name : cleanName(changes.name),
        updatedAt: new Date().toISOString(),
      }
      await projectAdapter.update(id, next)
      return next
    }),

  /** Elimina el proyecto, sus secciones y sus tareas (con subtareas). */
  remove: (id: string) =>
    atomically(async () => {
      const tasks = await taskAdapter.findByProjectId(id)
      await removeTaskTrees(tasks.map((task) => task.id))
      await sectionAdapter.removeByProjectId(id)
      await projectAdapter.remove(id)
    }),

  findById: (id: string) => projectAdapter.findById(id),
  findAll: () => projectAdapter.findAll(),
}
