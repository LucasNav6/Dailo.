import "fake-indexeddb/auto"
import Dexie from "dexie"
import { beforeEach, describe, expect, it } from "vitest"
import {
  createProject,
  createSection,
  createTask,
  db,
  deleteProject,
  deleteSection,
  deleteSetting,
  deleteTask,
  getProject,
  getSection,
  getSetting,
  getTask,
  listProjects,
  listSections,
  listSettings,
  listTasks,
  setSetting,
  updateProject,
  updateSection,
  updateTask,
} from "./database"
import type { Task } from "./models"

const newTask = (over: Partial<Task> = {}) =>
  createTask({ title: "t", status: "inbox", essential: false, position: 0, ...over })

beforeEach(async () => {
  await Promise.all([db.tasks.clear(), db.projects.clear(), db.sections.clear(), db.settings.clear()])
})

describe("tasks", () => {
  it("crea, lee, actualiza y elimina", async () => {
    const t = await newTask({ title: "a" })
    expect(t.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(await getTask(t.id)).toEqual(t)

    await new Promise((r) => setTimeout(r, 5))
    const u = await updateTask(t.id, { title: "b", status: "active", plannedDate: "2026-11-12", deadline: "2026-12-01" })
    expect(u.title).toBe("b")
    expect(u.createdAt).toBe(t.createdAt)
    expect(u.updatedAt > t.updatedAt).toBe(true)
    expect(u.plannedDate).toBe("2026-11-12")

    expect(await listTasks()).toHaveLength(1)
    await deleteTask(t.id)
    expect(await getTask(t.id)).toBeUndefined()
  })

  it("consulta mediante índices", async () => {
    await newTask({ status: "active", plannedDate: "2026-11-12" })
    await newTask({ status: "someday" })
    expect(await db.tasks.where("status").equals("active").count()).toBe(1)
    expect(await db.tasks.where("plannedDate").equals("2026-11-12").count()).toBe(1)
  })

  it("rechaza referencias inexistentes o incoherentes", async () => {
    await expect(newTask({ projectId: "x" })).rejects.toThrow()
    await expect(newTask({ parentId: "x" })).rejects.toThrow()
    const p1 = await createProject({ name: "p1", position: 0 })
    const p2 = await createProject({ name: "p2", position: 1 })
    const s = await createSection({ projectId: p1.id, name: "s", position: 0 })
    await expect(newTask({ projectId: p2.id, sectionId: s.id })).rejects.toThrow()
    await expect(newTask({ sectionId: s.id })).rejects.toThrow()
    const ok = await newTask({ projectId: p1.id, sectionId: s.id, status: "active", plannedDate: "2026-11-12" })
    await expect(updateTask(ok.id, { projectId: p2.id })).rejects.toThrow()
    await expect(updateTask(ok.id, { parentId: ok.id })).rejects.toThrow()
  })

  it("elimina subtareas con su tarea", async () => {
    const parent = await newTask()
    const child = await newTask({ parentId: parent.id })
    await newTask({ parentId: child.id })
    await deleteTask(parent.id)
    expect(await listTasks()).toHaveLength(0)
  })
})

describe("projects y sections", () => {
  it("crea, lee, actualiza y lista", async () => {
    const p = await createProject({ name: "p", position: 1 })
    await createProject({ name: "q", position: 0 })
    expect((await listProjects()).map((x) => x.name)).toEqual(["q", "p"])
    const u = await updateProject(p.id, { name: "z" })
    expect(u.createdAt).toBe(p.createdAt)
    expect((await getProject(p.id))?.name).toBe("z")

    const s = await createSection({ projectId: p.id, name: "s", position: 0 })
    expect(await listSections(p.id)).toHaveLength(1)
    expect((await updateSection(s.id, { name: "s2" })).name).toBe("s2")
    expect((await getSection(s.id))?.projectId).toBe(p.id)
  })

  it("rechaza sección sin proyecto", async () => {
    await expect(createSection({ projectId: "x", name: "s", position: 0 })).rejects.toThrow()
  })

  it("deleteSection desvincula tareas; deleteProject elimina en cascada", async () => {
    const p = await createProject({ name: "p", position: 0 })
    const s = await createSection({ projectId: p.id, name: "s", position: 0 })
    const t = await newTask({ projectId: p.id, sectionId: s.id })
    await deleteSection(s.id)
    const after = await getTask(t.id)
    expect(after?.sectionId).toBeUndefined()
    expect(after?.projectId).toBe(p.id)

    await deleteProject(p.id)
    expect(await listTasks()).toHaveLength(0)
    expect(await listSections()).toHaveLength(0)
    expect(await getProject(p.id)).toBeUndefined()
  })
})

describe("settings", () => {
  it("guarda, lee, sobrescribe y elimina", async () => {
    await setSetting("theme", "dark")
    await setSetting("theme", { mode: "light" })
    expect((await getSetting("theme"))?.value).toEqual({ mode: "light" })
    expect(await listSettings()).toHaveLength(1)
    await deleteSetting("theme")
    expect(await getSetting("theme")).toBeUndefined()
  })
})

describe("esquema", () => {
  it("persiste tras reabrir la base y declara la versión 1", async () => {
    const t = await newTask({ title: "persist" })
    db.close()
    const again = new Dexie("dailo")
    await again.open()
    expect(again.verno).toBe(1)
    expect(again.tables.map((x) => x.name).sort()).toEqual(["projects", "sections", "settings", "tasks"])
    expect((await again.table("tasks").get(t.id)).title).toBe("persist")
    again.close()
    await db.open()
  })
})
