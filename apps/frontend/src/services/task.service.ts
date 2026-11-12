import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import type { Task, TaskChanges, TaskInput } from "@/models/task.model"

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** YYYY-MM-DD que existe en el calendario (sin zona horaria). */
function isValidDate(value: string) {
  const match = ISO_DATE.exec(value)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

async function assertValid(task: Task) {
  if (!task.title) throw new Error("Task title is required")
  for (const date of [task.plannedDate, task.deadline]) {
    if (date !== undefined && !isValidDate(date))
      throw new Error(`Invalid date, expected YYYY-MM-DD: ${date}`)
  }
  if (task.projectId && !(await projectAdapter.findById(task.projectId)))
    throw new Error(`Project not found: ${task.projectId}`)
  if (task.sectionId) {
    const section = await sectionAdapter.findById(task.sectionId)
    if (!section) throw new Error(`Section not found: ${task.sectionId}`)
    if (section.projectId !== task.projectId)
      throw new Error("Section does not belong to the task project")
  }
  // La cadena de ancestros debe existir y no volver a la propia tarea.
  for (let id = task.parentId; id; ) {
    if (id === task.id) throw new Error("Task hierarchy cannot have cycles")
    const parent = await taskAdapter.findById(id)
    if (!parent) throw new Error(`Parent task not found: ${id}`)
    id = parent.parentId
  }
}

/** Elimina las tareas indicadas y todas sus subtareas. Requiere transacción. */
export async function removeTaskTrees(rootIds: string[]) {
  const ids = [...rootIds]
  for (let i = 0; i < ids.length; i++) {
    const children = await taskAdapter.findByParentId(ids[i])
    ids.push(...children.map((child) => child.id))
  }
  await taskAdapter.removeMany(ids)
}

export const taskService = {
  create: (input: TaskInput) =>
    atomically(async () => {
      const now = new Date().toISOString()
      const task: Task = {
        status: "inbox",
        essential: false,
        position: Date.now(),
        ...input,
        title: input.title.trim(),
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      }
      await assertValid(task)
      await taskAdapter.create(task)
      return task
    }),

  update: (id: string, changes: TaskChanges) =>
    atomically(async () => {
      const current = await taskAdapter.findById(id)
      if (!current) throw new Error(`Task not found: ${id}`)
      const now = new Date().toISOString()
      const next: Task = {
        ...current,
        ...changes,
        title: changes.title === undefined ? current.title : changes.title.trim(),
        updatedAt: now,
      }
      if (changes.status !== undefined && changes.status !== current.status) {
        next.completedAt = changes.status === "completed" ? now : undefined
      }
      await assertValid(next)
      await taskAdapter.update(id, next)
      return next
    }),

  /** Elimina la tarea y sus subtareas. */
  remove: (id: string) => atomically(() => removeTaskTrees([id])),

  findById: (id: string) => taskAdapter.findById(id),
  findAll: () => taskAdapter.findAll(),
  findByStatus: taskAdapter.findByStatus,
}
