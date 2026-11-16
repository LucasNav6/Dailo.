import Dexie, { type EntityTable } from "dexie"
import type { Project } from "@/models/project.model"
import type { Attachment } from "@/models/attachment.model"
import type { Section } from "@/models/section.model"
import type { Setting } from "@/models/setting.model"
import type { Task } from "@/models/task.model"

export const db = new Dexie("dailo") as Dexie & {
  tasks: EntityTable<Task, "id">
  projects: EntityTable<Project, "id">
  sections: EntityTable<Section, "id">
  settings: EntityTable<Setting, "key">
  attachments: EntityTable<Attachment, "id">
}

db.version(1).stores({
  tasks: "id, status, projectId, sectionId, parentId",
  projects: "id",
  sections: "id, projectId",
  settings: "key",
})

db.version(2).stores({
  attachments: "id, taskId",
})

export const atomically = <T>(operations: () => Promise<T>) =>
  db.transaction("rw", db.tasks, db.projects, db.sections, db.attachments, operations)

export const clearAllData = () =>
  db.transaction("rw", db.tables, () =>
    Promise.all(db.tables.map((table) => table.clear()))
  )
