import type { Task, TaskStatus } from "@/shared/models/task.model"

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function isValidDate(value: string) {
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

type Candidate = Pick<Task, "title" | "plannedDate" | "deadline" | "timeOfDay" | "parentId"> & { id?: string }

export function validateTask(task: Candidate, tasks: Task[]): string | null {
  if (!task.title.trim()) return "El título es obligatorio."
  if (task.timeOfDay && !task.plannedDate) return "Una franja horaria requiere una fecha planificada."
  for (const date of [task.plannedDate, task.deadline]) {
    if (date !== undefined && !isValidDate(date)) return "La fecha no es válida."
  }
  for (let id = task.parentId; id; ) {
    if (id === task.id) return "Una tarea no puede ser subtarea de sí misma."
    const parent = tasks.find((candidate) => candidate.id === id)
    if (!parent) return "La tarea principal ya no existe."
    id = parent.parentId
  }
  return null
}

export function withStatusStamps(current: Task, changes: Partial<Task>, now: string): Partial<Task> {
  if (changes.status === undefined || changes.status === current.status) return changes
  return {
    ...changes,
    completedAt: changes.status === "completed" ? now : undefined,
    deletedAt: changes.status === "discarded" ? now : undefined,
  }
}

export function descendantIds(rootIds: string[], tasks: Task[]) {
  const ids = [...rootIds]
  for (let index = 0; index < ids.length; index++) {
    for (const task of tasks) if (task.parentId === ids[index]) ids.push(task.id)
  }
  return ids
}

export const isVisible = (status: TaskStatus) => status === "active" || status === "completed"

export const byPosition = (a: Task, b: Task) => a.position - b.position
