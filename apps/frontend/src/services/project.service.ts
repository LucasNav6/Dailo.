import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import type {
  Project,
  ProjectChanges,
  ProjectInput,
} from "@/models/project.model"
import type { Section } from "@/models/section.model"
import type { Task } from "@/models/task.model"
import { ValidationError } from "./errors"

export interface ProjectProgress {
  /** Tareas sin completar ni descartar (incluye subtareas). */
  pending: number
  completed: number
  /** 0–1; 0 si el proyecto no tiene tareas. */
  ratio: number
}

export type ProjectWithProgress = Project & { progress: ProjectProgress }

export interface TaskNode {
  task: Task
  children: TaskNode[]
}

export interface ProjectOverview {
  project: ProjectWithProgress
  sections: Section[]
  /** Tareas de primer nivel sin sección. */
  unsectioned: TaskNode[]
  /** Tareas de primer nivel por id de sección. */
  bySection: Record<string, TaskNode[]>
}

const byPosition = <T extends { position: number; createdAt: string }>(
  a: T,
  b: T
) => a.position - b.position || a.createdAt.localeCompare(b.createdAt)

function cleanName(name: string) {
  const value = name.trim()
  if (!value) throw new ValidationError("Project name is required")
  return value
}

function progressOf(tasks: Task[]): ProjectProgress {
  let pending = 0
  let completed = 0
  for (const task of tasks) {
    if (task.status === "completed") completed++
    else if (task.status !== "discarded") pending++
  }
  const total = pending + completed
  return { pending, completed, ratio: total ? completed / total : 0 }
}

/** Árbol de tareas por parentId; las descartadas no se muestran. */
function buildTree(tasks: Task[]): TaskNode[] {
  const nodes = new Map<string, TaskNode>()
  for (const task of tasks.filter((item) => item.status !== "discarded"))
    nodes.set(task.id, { task, children: [] })
  const roots: TaskNode[] = []
  for (const node of [...nodes.values()].sort((a, b) =>
    byPosition(a.task, b.task)
  )) {
    const parent = node.task.parentId && nodes.get(node.task.parentId)
    if (parent) parent.children.push(node)
    else if (!node.task.parentId) roots.push(node)
  }
  return roots
}

export const projectService = {
  create: async (input: ProjectInput) => {
    const now = new Date().toISOString()
    const project: Project = {
      position: Date.now(),
      ...input,
      name: cleanName(input.name),
      description: input.description?.trim() || undefined,
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
        description:
          changes.description === undefined
            ? current.description
            : changes.description.trim() || undefined,
        updatedAt: new Date().toISOString(),
      }
      await projectAdapter.update(id, next)
      return next
    }),

  /**
   * Elimina el proyecto y sus secciones. Las tareas se conservan, sin proyecto
   * ni sección, para no perder trabajo por borrar su contenedor.
   */
  remove: (id: string) =>
    atomically(async () => {
      const now = new Date().toISOString()
      await taskAdapter.detachProject(id, now)
      await sectionAdapter.removeByProjectId(id)
      await projectAdapter.remove(id)
    }),

  findById: (id: string) => projectAdapter.findById(id),

  /** Proyectos ordenados por position. */
  findAll: async () => (await projectAdapter.findAll()).sort(byPosition),

  /** Proyectos ordenados, con pendientes y progreso reales. */
  findAllWithProgress: async (): Promise<ProjectWithProgress[]> => {
    const [projects, tasks] = await Promise.all([
      projectAdapter.findAll(),
      taskAdapter.findAll(),
    ])
    return projects.sort(byPosition).map((project) => ({
      ...project,
      progress: progressOf(tasks.filter((task) => task.projectId === project.id)),
    }))
  },

  /** Contenido del proyecto, o null si no existe. */
  getOverview: async (id: string): Promise<ProjectOverview | null> => {
    const project = await projectAdapter.findById(id)
    if (!project) return null
    const [sections, tasks] = await Promise.all([
      sectionAdapter.findByProjectId(id),
      taskAdapter.findByProjectId(id),
    ])
    sections.sort(byPosition)
    const bySection: Record<string, TaskNode[]> = {}
    const unsectioned: TaskNode[] = []
    for (const node of buildTree(tasks)) {
      const sectionId = node.task.sectionId
      if (sectionId && sections.some((section) => section.id === sectionId))
        (bySection[sectionId] ??= []).push(node)
      else unsectioned.push(node)
    }
    return {
      project: { ...project, progress: progressOf(tasks) },
      sections,
      unsectioned,
      bySection,
    }
  },
}
