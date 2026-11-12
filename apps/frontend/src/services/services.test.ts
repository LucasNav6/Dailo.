import "fake-indexeddb/auto"
import Dexie from "dexie"
import { beforeEach, describe, expect, it } from "vitest"
import { db } from "@/adapters/database"
import { projectService } from "./project.service"
import { sectionService } from "./section.service"
import { taskService } from "./task.service"

beforeEach(async () => {
  await Promise.all([
    db.tasks.clear(),
    db.projects.clear(),
    db.sections.clear(),
    db.settings.clear(),
  ])
})

describe("taskService", () => {
  it("crea con valores por defecto y lee por id y por estado", async () => {
    const task = await taskService.create({ title: "  Comprar pan  " })
    expect(task).toMatchObject({
      title: "Comprar pan",
      status: "inbox",
      essential: false,
    })
    expect(task.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(task.createdAt).toBe(task.updatedAt)
    expect(await taskService.findById(task.id)).toEqual(task)

    await taskService.create({ title: "b", status: "active" })
    expect(await taskService.findAll()).toHaveLength(2)
    expect(await taskService.findByStatus("inbox")).toHaveLength(1)
  })

  it("valida título y fechas", async () => {
    await expect(taskService.create({ title: "   " })).rejects.toThrow("title")
    await expect(
      taskService.create({ title: "a", plannedDate: "2026-02-30" })
    ).rejects.toThrow("Invalid date")
    await expect(
      taskService.create({ title: "a", deadline: "12/11/2026" })
    ).rejects.toThrow("Invalid date")
    const task = await taskService.create({
      title: "a",
      plannedDate: "2026-11-12",
      deadline: "2026-11-01",
    })
    expect(task.plannedDate).toBe("2026-11-12")
    expect(task.deadline).toBe("2026-11-01")
  })

  it("actualiza sin tocar createdAt y gestiona completedAt", async () => {
    const task = await taskService.create({ title: "a" })
    await new Promise((resolve) => setTimeout(resolve, 5))
    const done = await taskService.update(task.id, { status: "completed" })
    expect(done.createdAt).toBe(task.createdAt)
    expect(done.updatedAt > task.updatedAt).toBe(true)
    expect(done.completedAt).toBeDefined()
    expect((await taskService.findById(task.id))?.completedAt).toBe(done.completedAt)

    const reopened = await taskService.update(task.id, { status: "active" })
    expect(reopened.completedAt).toBeUndefined()
    expect((await taskService.findById(task.id))?.completedAt).toBeUndefined()
    await expect(taskService.update("x", { title: "b" })).rejects.toThrow("not found")
  })

  it("mantiene coherencia entre proyecto y sección", async () => {
    const p1 = await projectService.create({ name: "p1" })
    const p2 = await projectService.create({ name: "p2" })
    const section = await sectionService.create({ projectId: p1.id, name: "s" })

    await expect(taskService.create({ title: "a", projectId: "x" })).rejects.toThrow("Project")
    await expect(taskService.create({ title: "a", sectionId: section.id })).rejects.toThrow("Section")
    await expect(
      taskService.create({ title: "a", projectId: p2.id, sectionId: section.id })
    ).rejects.toThrow("Section")

    const task = await taskService.create({
      title: "a",
      status: "active",
      plannedDate: "2026-11-12",
      projectId: p1.id,
      sectionId: section.id,
    })
    await expect(taskService.update(task.id, { projectId: p2.id })).rejects.toThrow("Section")
  })

  it("valida subtareas y rechaza ciclos", async () => {
    await expect(taskService.create({ title: "a", parentId: "x" })).rejects.toThrow("Parent")
    const a = await taskService.create({ title: "a" })
    const b = await taskService.create({ title: "b", parentId: a.id })
    const c = await taskService.create({ title: "c", parentId: b.id })
    await expect(taskService.update(a.id, { parentId: a.id })).rejects.toThrow("cycles")
    await expect(taskService.update(a.id, { parentId: c.id })).rejects.toThrow("cycles")
  })

  it("elimina la tarea con sus subtareas", async () => {
    const a = await taskService.create({ title: "a" })
    const b = await taskService.create({ title: "b", parentId: a.id })
    await taskService.create({ title: "c", parentId: b.id })
    const other = await taskService.create({ title: "otra" })
    await taskService.remove(a.id)
    expect(await taskService.findAll()).toEqual([other])
  })
})

describe("projectService y sectionService", () => {
  it("crea, actualiza y valida", async () => {
    await expect(projectService.create({ name: " " })).rejects.toThrow("name")
    const project = await projectService.create({ name: " P " })
    expect(project.name).toBe("P")
    const updated = await projectService.update(project.id, { description: "d" })
    expect(updated.createdAt).toBe(project.createdAt)
    expect((await projectService.findById(project.id))?.description).toBe("d")

    await expect(sectionService.create({ projectId: "x", name: "s" })).rejects.toThrow("Project")
    await expect(sectionService.create({ projectId: project.id, name: "" })).rejects.toThrow("name")
    const section = await sectionService.create({ projectId: project.id, name: "s" })
    await sectionService.update(section.id, { name: "s2" })
    const sections = await sectionService.findByProjectId(project.id)
    expect(sections.map((s) => s.name)).toEqual(["s2"])
    expect(sections[0].projectId).toBe(project.id)
  })

  it("al eliminar una sección sus tareas quedan sin sección", async () => {
    const project = await projectService.create({ name: "p" })
    const section = await sectionService.create({ projectId: project.id, name: "s" })
    const task = await taskService.create({ title: "a", projectId: project.id, sectionId: section.id })
    await sectionService.remove(section.id)
    const after = await taskService.findById(task.id)
    expect(after?.sectionId).toBeUndefined()
    expect(after?.projectId).toBe(project.id)
  })

  it("al eliminar un proyecto elimina secciones, tareas y subtareas ajenas", async () => {
    const project = await projectService.create({ name: "p" })
    await sectionService.create({ projectId: project.id, name: "s" })
    const task = await taskService.create({ title: "a", projectId: project.id })
    await taskService.create({ title: "sub sin proyecto", parentId: task.id })
    const keep = await taskService.create({ title: "libre" })
    await projectService.remove(project.id)
    expect(await projectService.findAll()).toHaveLength(0)
    expect(await sectionService.findByProjectId(project.id)).toHaveLength(0)
    expect(await taskService.findAll()).toEqual([keep])
  })
})

describe("persistencia", () => {
  it("los datos sobreviven al reabrir la base y el esquema es v1", async () => {
    const task = await taskService.create({ title: "persiste" })
    db.close()
    const reopened = new Dexie("dailo")
    await reopened.open()
    expect(reopened.verno).toBe(1)
    expect(reopened.tables.map((t) => t.name).sort()).toEqual([
      "projects",
      "sections",
      "settings",
      "tasks",
    ])
    expect((await reopened.table("tasks").get(task.id)).title).toBe("persiste")
    reopened.close()
    await db.open()
  })
})
