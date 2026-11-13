import { atomically } from "@/adapters/database"
import { projectAdapter } from "@/adapters/project.adapter"
import { sectionAdapter } from "@/adapters/section.adapter"
import { taskAdapter } from "@/adapters/task.adapter"
import type {
  Task,
  TaskChanges,
  TaskInput,
  TimeOfDay,
} from "@/models/task.model"
import { ValidationError } from "./errors"

/** Decisión explícita que saca un elemento de Inbox. */
export type InboxDecision =
  | {
      type: "activate"
      projectId?: string
      plannedDate?: string
      timeOfDay?: TimeOfDay
    }
  | { type: "someday" }
  | { type: "complete" }
  | { type: "discard" }

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
  if (!task.title) throw new ValidationError("Task title is required")
  if (task.timeOfDay && !task.plannedDate)
    throw new Error("A time of day requires a planned date")
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

/** Los ids de la tarea y de todos sus descendientes. */
async function collectTree(rootId: string) {
  const ids = [rootId]
  for (let i = 0; i < ids.length; i++) {
    const children = await taskAdapter.findByParentId(ids[i])
    ids.push(...children.map((child) => child.id))
  }
  return ids
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

  /** Subtarea activa: hereda proyecto y sección de su tarea madre. */
  createSubtask: (parentId: string, input: Pick<TaskInput, "title">) =>
    atomically(async () => {
      const parent = await taskAdapter.findById(parentId)
      if (!parent) throw new Error(`Parent task not found: ${parentId}`)
      return taskService.create({
        title: input.title,
        parentId,
        projectId: parent.projectId,
        sectionId: parent.sectionId,
        status: "active",
      })
    }),

  /** Completa o reactiva una tarea. */
  setCompleted: (id: string, completed: boolean) =>
    taskService.update(id, { status: completed ? "completed" : "active" }),

  /** Descarte lógico (recuperable) de la tarea y sus subtareas. */
  discard: (id: string) =>
    atomically(async () => {
      if (!(await taskAdapter.findById(id))) throw new Error(`Task not found: ${id}`)
      const now = new Date().toISOString()
      for (const taskId of await collectTree(id))
        await taskAdapter.update(taskId, {
          status: "discarded",
          deletedAt: now,
          updatedAt: now,
        })
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

  /**
   * Procesa un elemento de Inbox con una decisión explícita. Es la única vía
   * por la que un elemento abandona Inbox. `edits` (título/descripción) se
   * guardan en la misma operación.
   */
  decide: (
    id: string,
    decision: InboxDecision,
    edits: Pick<TaskChanges, "title" | "description"> = {}
  ) =>
    atomically(async () => {
      const current = await taskAdapter.findById(id)
      if (!current) throw new Error(`Task not found: ${id}`)
      if (current.status !== "inbox")
        throw new Error(`Task is not in the inbox: ${id}`)
      const now = new Date().toISOString()
      const next: Task = {
        ...current,
        ...edits,
        title: edits.title === undefined ? current.title : edits.title.trim(),
        updatedAt: now,
      }
      switch (decision.type) {
        case "activate":
          next.status = "active"
          next.projectId = decision.projectId
          next.plannedDate = decision.plannedDate
          next.timeOfDay = decision.plannedDate ? decision.timeOfDay : undefined
          break
        case "someday":
          next.status = "someday"
          break
        case "complete":
          next.status = "completed"
          next.completedAt = now
          break
        case "discard":
          next.status = "discarded"
          next.deletedAt = now
          break
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
  /** Inbox con las capturas más recientes primero. */
  findInbox: async () =>
    (await taskAdapter.findByStatus("inbox")).sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || b.position - a.position
    ),
}
