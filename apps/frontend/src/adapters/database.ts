import Dexie, { type EntityTable } from "dexie"
import type { Project } from "@/models/project.model"
import type { Section } from "@/models/section.model"
import type { Setting } from "@/models/setting.model"
import type { Task } from "@/models/task.model"

export const db = new Dexie("dailo") as Dexie & {
  tasks: EntityTable<Task, "id">
  projects: EntityTable<Project, "id">
  sections: EntityTable<Section, "id">
  settings: EntityTable<Setting, "key">
}

// Cambios de esquema futuros: agregar db.version(2).stores({...}) sin
// modificar la versión 1. Solo se indexa lo que se consulta.
db.version(1).stores({
  tasks: "id, status, projectId, sectionId, parentId",
  projects: "id",
  sections: "id, projectId",
  settings: "key",
})

/** Agrupa varias operaciones en una transacción atómica. */
export const atomically = <T>(operations: () => Promise<T>) =>
  db.transaction("rw", db.tasks, db.projects, db.sections, operations)
