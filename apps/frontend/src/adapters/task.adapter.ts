import type { Task, TaskStatus } from "@/models/task.model"
import { db } from "./database"

export const taskAdapter = {
  create: (task: Task) => db.tasks.add(task),
  findById: (id: string) => db.tasks.get(id),
  findAll: () => db.tasks.toArray(),
  findByStatus: (status: TaskStatus) =>
    db.tasks.where("status").equals(status).toArray(),
  findByProjectId: (projectId: string) =>
    db.tasks.where("projectId").equals(projectId).toArray(),
  findByParentId: (parentId: string) =>
    db.tasks.where("parentId").equals(parentId).toArray(),
  update: (id: string, changes: Partial<Task>) => db.tasks.update(id, changes),
  remove: (id: string) => db.tasks.delete(id),
  removeMany: (ids: string[]) => db.tasks.bulkDelete(ids),
  /** Quita proyecto y sección de las tareas de un proyecto (las conserva). */
  detachProject: (projectId: string, updatedAt: string) =>
    db.tasks
      .where("projectId")
      .equals(projectId)
      .modify((task) => {
        delete task.projectId
        delete task.sectionId
        task.updatedAt = updatedAt
      }),
  /** Deja sin sección las tareas de una sección. */
  clearSection: (sectionId: string, updatedAt: string) =>
    db.tasks
      .where("sectionId")
      .equals(sectionId)
      .modify((task) => {
        delete task.sectionId
        task.updatedAt = updatedAt
      }),
}
