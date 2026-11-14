import "fake-indexeddb/auto"
import { beforeEach, describe, expect, it } from "vitest"
import { clearAllData } from "@/adapters/database"
import { ValidationError } from "./errors"
import { projectService } from "./project.service"
import { sectionService } from "./section.service"
import { taskService } from "./task.service"

beforeEach(clearAllData)

const tick = () => new Promise((resolve) => setTimeout(resolve, 3))

describe("proyectos", () => {
  it("recorta el nombre y la descripción y asigna id y fechas", async () => {
    const project = await projectService.create({
      name: "  Forky  ",
      description: "  Infra  ",
    })
    expect(project).toMatchObject({ name: "Forky", description: "Infra" })
    expect(project.id).toMatch(/[0-9a-f-]{36}/)
    expect(project.createdAt).toBe(project.updatedAt)
  })

  it("descarta descripciones vacías", async () => {
    const project = await projectService.create({ name: "A", description: "   " })
    expect(project.description).toBeUndefined()
  })

  it.each(["", "   "])("rechaza nombres vacíos (%j)", async (name) => {
    await expect(projectService.create({ name })).rejects.toBeInstanceOf(ValidationError)
    expect(await projectService.findAll()).toHaveLength(0)
  })

  it("edita conservando createdAt y actualizando updatedAt", async () => {
    const project = await projectService.create({ name: "A" })
    await tick()
    const next = await projectService.update(project.id, { name: " B ", description: "x" })
    expect(next).toMatchObject({ name: "B", description: "x", createdAt: project.createdAt })
    expect(next.updatedAt > project.updatedAt).toBe(true)
    await expect(projectService.update(project.id, { name: " " })).rejects.toBeInstanceOf(ValidationError)
  })

  it("lista ordenado por position", async () => {
    await projectService.create({ name: "tercero", position: 3 })
    await projectService.create({ name: "primero", position: 1 })
    await projectService.create({ name: "segundo", position: 2 })
    expect((await projectService.findAll()).map((p) => p.name)).toEqual(["primero", "segundo", "tercero"])
  })
})

describe("progreso", () => {
  it("cuenta pendientes y completadas, ignorando descartadas", async () => {
    const project = await projectService.create({ name: "P" })
    const a = await taskService.create({ title: "a", projectId: project.id, status: "active" })
    const b = await taskService.create({ title: "b", projectId: project.id, status: "active" })
    await taskService.create({ title: "c", projectId: project.id, status: "active" })
    const d = await taskService.create({ title: "d", projectId: project.id, status: "active" })
    await taskService.create({ title: "otra", status: "active" })
    await taskService.setCompleted(a.id, true)
    await taskService.setCompleted(b.id, true)
    await taskService.discard(d.id)

    const [item] = await projectService.findAllWithProgress()
    expect(item.progress).toEqual({ pending: 1, completed: 2, ratio: 2 / 3 })
  })

  it("es 0 sin tareas y vuelve a bajar al reactivar", async () => {
    const project = await projectService.create({ name: "P" })
    expect((await projectService.findAllWithProgress())[0].progress.ratio).toBe(0)
    const task = await taskService.create({ title: "a", projectId: project.id, status: "active" })
    await taskService.setCompleted(task.id, true)
    expect((await projectService.findAllWithProgress())[0].progress.ratio).toBe(1)
    await taskService.setCompleted(task.id, false)
    expect((await projectService.findAllWithProgress())[0].progress).toMatchObject({ pending: 1, completed: 0, ratio: 0 })
  })
})

describe("detalle", () => {
  it("devuelve null si el proyecto no existe", async () => {
    expect(await projectService.getOverview("missing")).toBeNull()
  })

  it("agrupa tareas sin sección, por sección y subtareas anidadas", async () => {
    const project = await projectService.create({ name: "P" })
    const section = await sectionService.create({ projectId: project.id, name: "S" })
    const loose = await taskService.create({ title: "suelta", projectId: project.id, status: "active" })
    await tick()
    const inSection = await taskService.create({ title: "en sección", projectId: project.id, sectionId: section.id, status: "active" })
    await taskService.createSubtask(loose.id, { title: "sub" })
    const gone = await taskService.create({ title: "descartada", projectId: project.id, status: "active" })
    await taskService.discard(gone.id)

    const overview = await projectService.getOverview(project.id)
    expect(overview?.unsectioned.map((n) => n.task.title)).toEqual(["suelta"])
    expect(overview?.unsectioned[0].children.map((n) => n.task.title)).toEqual(["sub"])
    expect(overview?.bySection[section.id].map((n) => n.task.id)).toEqual([inSection.id])
  })
})

describe("eliminar proyecto", () => {
  it("conserva las tareas sin proyecto ni sección y elimina las secciones", async () => {
    const project = await projectService.create({ name: "P" })
    const section = await sectionService.create({ projectId: project.id, name: "S" })
    const parent = await taskService.create({ title: "madre", projectId: project.id, sectionId: section.id, status: "active" })
    const child = await taskService.createSubtask(parent.id, { title: "hija" })
    const done = await taskService.create({ title: "hecha", projectId: project.id, status: "active" })
    await taskService.setCompleted(done.id, true)

    await projectService.remove(project.id)

    expect(await projectService.findById(project.id)).toBeUndefined()
    expect(await sectionService.findById(section.id)).toBeUndefined()
    for (const id of [parent.id, child.id, done.id]) {
      const task = await taskService.findById(id)
      expect(task).toBeDefined()
      expect(task?.projectId).toBeUndefined()
      expect(task?.sectionId).toBeUndefined()
    }
    expect((await taskService.findById(child.id))?.parentId).toBe(parent.id)
    expect((await taskService.findById(done.id))?.status).toBe("completed")
  })
})
