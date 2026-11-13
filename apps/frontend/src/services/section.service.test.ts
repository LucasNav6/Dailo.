import "fake-indexeddb/auto"
import { beforeEach, describe, expect, it } from "vitest"
import { clearAllData } from "@/adapters/database"
import { ValidationError } from "./errors"
import { projectService } from "./project.service"
import { sectionService } from "./section.service"
import { taskService } from "./task.service"

beforeEach(clearAllData)

async function setup() {
  const project = await projectService.create({ name: "P" })
  const names = ["A", "B", "C"]
  const sections = []
  for (const name of names) {
    sections.push(await sectionService.create({ projectId: project.id, name }))
    await new Promise((resolve) => setTimeout(resolve, 3))
  }
  return { project, sections }
}

const order = async (projectId: string) =>
  (await sectionService.findByProjectId(projectId)).map((s) => s.name)

describe("secciones", () => {
  it("crea con nombre recortado y rechaza vacíos o proyecto inexistente", async () => {
    const project = await projectService.create({ name: "P" })
    const section = await sectionService.create({ projectId: project.id, name: "  Ideas " })
    expect(section.name).toBe("Ideas")
    await expect(sectionService.create({ projectId: project.id, name: " " })).rejects.toBeInstanceOf(ValidationError)
    await expect(sectionService.create({ projectId: "nope", name: "x" })).rejects.toThrow()
  })

  it("renombra", async () => {
    const { sections } = await setup()
    const next = await sectionService.update(sections[0].id, { name: " Nueva " })
    expect(next.name).toBe("Nueva")
    await expect(sectionService.update(sections[0].id, { name: "" })).rejects.toBeInstanceOf(ValidationError)
  })

  it("reordena subiendo y bajando, sin salirse de los extremos", async () => {
    const { project, sections } = await setup()
    expect(await order(project.id)).toEqual(["A", "B", "C"])
    await sectionService.move(sections[2].id, "up")
    expect(await order(project.id)).toEqual(["A", "C", "B"])
    await sectionService.move(sections[0].id, "down")
    expect(await order(project.id)).toEqual(["C", "A", "B"])
    await sectionService.move(sections[1].id, "down") // B ya es la última
    await sectionService.move(sections[2].id, "up") // C ya es la primera
    expect(await order(project.id)).toEqual(["C", "A", "B"])
  })

  it("al eliminar conserva las tareas con su proyecto y sin sección", async () => {
    const { project, sections } = await setup()
    const task = await taskService.create({ title: "t", projectId: project.id, sectionId: sections[0].id, status: "active" })
    await sectionService.remove(sections[0].id)
    expect(await order(project.id)).toEqual(["B", "C"])
    const saved = await taskService.findById(task.id)
    expect(saved?.projectId).toBe(project.id)
    expect(saved?.sectionId).toBeUndefined()
  })

  it("una tarea solo puede usar secciones de su proyecto", async () => {
    const { sections } = await setup()
    const other = await projectService.create({ name: "Otro" })
    await expect(
      taskService.create({ title: "t", projectId: other.id, sectionId: sections[0].id, status: "active" })
    ).rejects.toThrow()
  })
})
