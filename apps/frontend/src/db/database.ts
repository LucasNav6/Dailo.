import Dexie, { type EntityTable } from "dexie"
import type { Project, Section, Setting, Task } from "./models"

export const db = new Dexie("dailo") as Dexie & {
  tasks: EntityTable<Task, "id">
  projects: EntityTable<Project, "id">
  sections: EntityTable<Section, "id">
  settings: EntityTable<Setting, "key">
}

// Para cambiar el esquema: agregar db.version(2).stores({...}).upgrade(...)
// sin modificar la versión 1.
db.version(1).stores({
  tasks: "id, status, projectId, sectionId, parentId, plannedDate, deadline",
  projects: "id, position",
  sections: "id, projectId",
  settings: "key",
})

const now = () => new Date().toISOString()

type Created<T> = Omit<T, "id" | "createdAt" | "updatedAt">
type Changes<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>

async function assertTaskRefs(
  t: Pick<Task, "projectId" | "sectionId" | "parentId">
) {
  if (t.projectId && !(await db.projects.get(t.projectId)))
    throw new Error(`Proyecto inexistente: ${t.projectId}`)
  if (t.sectionId) {
    const section = await db.sections.get(t.sectionId)
    if (!section) throw new Error(`Sección inexistente: ${t.sectionId}`)
    if (section.projectId !== t.projectId)
      throw new Error("La sección no pertenece al proyecto indicado")
  }
  if (t.parentId && !(await db.tasks.get(t.parentId)))
    throw new Error(`Tarea padre inexistente: ${t.parentId}`)
}

/** Rechaza que `parentId` sea la propia tarea o uno de sus descendientes. */
async function assertNoCycle(id: string, parentId?: string) {
  for (let cur = parentId; cur; cur = (await db.tasks.get(cur))?.parentId) {
    if (cur === id) throw new Error("La jerarquía de tareas no puede tener ciclos")
  }
}

/** Elimina las tareas dadas y todos sus descendientes. */
async function deleteTaskTrees(rootIds: string[]) {
  const ids = [...rootIds]
  for (let i = 0; i < ids.length; i++) {
    ids.push(...(await db.tasks.where("parentId").equals(ids[i]).primaryKeys()))
  }
  await db.tasks.bulkDelete(ids)
}

// Tasks

export function createTask(data: Created<Task>): Promise<Task> {
  return db.transaction("rw", db.tasks, db.projects, db.sections, async () => {
    await assertTaskRefs(data)
    const ts = now()
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: ts,
      updatedAt: ts,
    }
    await db.tasks.add(task)
    return task
  })
}

export const getTask = (id: string) => db.tasks.get(id)

export const listTasks = () => db.tasks.toArray()

export function updateTask(id: string, changes: Changes<Task>): Promise<Task> {
  return db.transaction("rw", db.tasks, db.projects, db.sections, async () => {
    const current = await db.tasks.get(id)
    if (!current) throw new Error(`Tarea inexistente: ${id}`)
    const next: Task = {
      ...current,
      ...changes,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: now(),
    }
    await assertNoCycle(id, next.parentId)
    await assertTaskRefs(next)
    await db.tasks.put(next)
    return next
  })
}

/** Elimina la tarea y sus subtareas. */
export function deleteTask(id: string): Promise<void> {
  return db.transaction("rw", db.tasks, () => deleteTaskTrees([id]))
}

// Projects

export async function createProject(data: Created<Project>): Promise<Project> {
  const ts = now()
  const project: Project = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  }
  await db.projects.add(project)
  return project
}

export const getProject = (id: string) => db.projects.get(id)

export const listProjects = () => db.projects.orderBy("position").toArray()

export function updateProject(
  id: string,
  changes: Changes<Project>
): Promise<Project> {
  return db.transaction("rw", db.projects, async () => {
    const current = await db.projects.get(id)
    if (!current) throw new Error(`Proyecto inexistente: ${id}`)
    const next: Project = {
      ...current,
      ...changes,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: now(),
    }
    await db.projects.put(next)
    return next
  })
}

/** Elimina el proyecto, sus secciones y sus tareas. */
export function deleteProject(id: string): Promise<void> {
  return db.transaction("rw", db.projects, db.sections, db.tasks, async () => {
    await deleteTaskTrees(await db.tasks.where("projectId").equals(id).primaryKeys())
    await db.sections.where("projectId").equals(id).delete()
    await db.projects.delete(id)
  })
}

// Sections

export function createSection(data: Created<Section>): Promise<Section> {
  return db.transaction("rw", db.sections, db.projects, async () => {
    if (!(await db.projects.get(data.projectId)))
      throw new Error(`Proyecto inexistente: ${data.projectId}`)
    const ts = now()
    const section: Section = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: ts,
      updatedAt: ts,
    }
    await db.sections.add(section)
    return section
  })
}

export const getSection = (id: string) => db.sections.get(id)

export const listSections = (projectId?: string) =>
  projectId
    ? db.sections.where("projectId").equals(projectId).sortBy("position")
    : db.sections.toArray()

export function updateSection(
  id: string,
  changes: Omit<Changes<Section>, "projectId">
): Promise<Section> {
  return db.transaction("rw", db.sections, async () => {
    const current = await db.sections.get(id)
    if (!current) throw new Error(`Sección inexistente: ${id}`)
    const next: Section = {
      ...current,
      ...changes,
      id: current.id,
      projectId: current.projectId,
      createdAt: current.createdAt,
      updatedAt: now(),
    }
    await db.sections.put(next)
    return next
  })
}

/** Elimina la sección; sus tareas quedan en el proyecto sin sección. */
export function deleteSection(id: string): Promise<void> {
  return db.transaction("rw", db.sections, db.tasks, async () => {
    await db.tasks
      .where("sectionId")
      .equals(id)
      .modify((t) => {
        delete t.sectionId
        t.updatedAt = now()
      })
    await db.sections.delete(id)
  })
}

// Settings

export const getSetting = (key: string) => db.settings.get(key)

export const listSettings = () => db.settings.toArray()

/** Crea o actualiza. */
export const setSetting = (key: string, value: unknown) =>
  db.settings.put({ key, value })

export const deleteSetting = (key: string) => db.settings.delete(key)
