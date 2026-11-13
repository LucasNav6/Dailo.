import "fake-indexeddb/auto"
import { beforeEach, describe, expect, it } from "vitest"
import { clearAllData } from "@/adapters/database"
import { projectService } from "./project.service"
import { taskService } from "./task.service"

beforeEach(clearAllData)

const tick = () => new Promise((resolve) => setTimeout(resolve, 3))

describe("captura rápida (create)", () => {
  it("guarda solo el título, con estado inbox y sin datos de organización", async () => {
    const task = await taskService.create({ title: "Revisar lo del banco" })
    const saved = await taskService.findById(task.id)

    expect(saved).toMatchObject({
      title: "Revisar lo del banco",
      status: "inbox",
      essential: false,
    })
    expect(saved?.projectId).toBeUndefined()
    expect(saved?.plannedDate).toBeUndefined()
    expect(saved?.description).toBeUndefined()
    expect(saved?.parentId).toBeUndefined()
  })

  it("elimina espacios al inicio y al final y conserva el contenido", async () => {
    const task = await taskService.create({ title: "  Hablar con Juan\ny el banco  " })
    expect(task.title).toBe("Hablar con Juan\ny el banco")
  })

  it.each(["", "   ", "\n\t "])("rechaza títulos vacíos (%j)", async (title) => {
    await expect(taskService.create({ title })).rejects.toThrow()
    expect(await taskService.findAll()).toHaveLength(0)
  })

  it("permite títulos repetidos", async () => {
    await taskService.create({ title: "Comprar café" })
    await taskService.create({ title: "Comprar café" })
    expect(await taskService.findInbox()).toHaveLength(2)
  })
})

describe("Inbox", () => {
  it("lista las capturas más recientes primero y solo las de inbox", async () => {
    const a = await taskService.create({ title: "a" })
    await tick()
    const b = await taskService.create({ title: "b" })
    await taskService.create({ title: "activa", status: "active" })

    const inbox = await taskService.findInbox()
    expect(inbox.map((task) => task.title)).toEqual(["b", "a"])
    expect(inbox.map((task) => task.id)).toEqual([b.id, a.id])
  })

  it("editar título y descripción no saca el elemento de Inbox", async () => {
    const task = await taskService.create({ title: "Revisar gastos de Forky" })
    await taskService.update(task.id, {
      title: "Revisar gastos de infraestructura de Forky",
      description: "Cloudflare, dominios y servicios",
    })

    const [item] = await taskService.findInbox()
    expect(item).toMatchObject({
      title: "Revisar gastos de infraestructura de Forky",
      description: "Cloudflare, dominios y servicios",
      status: "inbox",
    })
  })
})

describe("decide (procesamiento)", () => {
  it("activa con proyecto y deadline, guardando las ediciones", async () => {
    const project = await projectService.create({ name: "Forky" })
    const task = await taskService.create({ title: "gastos" })

    const next = await taskService.decide(
      task.id,
      {
        type: "activate",
        projectId: project.id,
        deadline: "2026-11-13",
      },
      { title: "Revisar gastos de Forky", description: "Comparar con presupuesto" }
    )

    expect(next).toMatchObject({
      status: "active",
      projectId: project.id,
      deadline: "2026-11-13",
      title: "Revisar gastos de Forky",
      description: "Comparar con presupuesto",
    })
    expect(await taskService.findInbox()).toHaveLength(0)
  })

  it("activa sin fecha", async () => {
    const task = await taskService.create({ title: "x" })
    const next = await taskService.decide(task.id, { type: "activate" })
    expect(next.status).toBe("active")
    expect(next.deadline).toBeUndefined()
    expect(next.projectId).toBeUndefined()
    expect(next.plannedDate).toBeUndefined()
    expect(next.timeOfDay).toBeUndefined()
  })

  it("mueve a Tal vez", async () => {
    const task = await taskService.create({ title: "x" })
    expect((await taskService.decide(task.id, { type: "someday" })).status).toBe("someday")
  })

  it("completa registrando completedAt", async () => {
    const task = await taskService.create({ title: "x" })
    const next = await taskService.decide(task.id, { type: "complete" })
    expect(next.status).toBe("completed")
    expect(next.completedAt).toBeDefined()
  })

  it("descarta de forma lógica (no borra el registro)", async () => {
    const task = await taskService.create({ title: "x" })
    const next = await taskService.decide(task.id, { type: "discard" })
    expect(next.status).toBe("discarded")
    expect(next.deletedAt).toBeDefined()
    expect(await taskService.findById(task.id)).toBeDefined()
  })

  it("no guarda nada si la decisión es inválida", async () => {
    const task = await taskService.create({ title: "x" })
    await expect(
      taskService.decide(task.id, { type: "activate", deadline: "2026-02-31" })
    ).rejects.toThrow()
    await expect(
      taskService.decide(task.id, { type: "activate", projectId: "nope" })
    ).rejects.toThrow()
    await expect(
      taskService.decide(task.id, { type: "someday" }, { title: "   " })
    ).rejects.toThrow()
    expect((await taskService.findById(task.id))?.status).toBe("inbox")
  })

  it("solo procesa elementos que están en Inbox", async () => {
    const task = await taskService.create({ title: "x" })
    await taskService.decide(task.id, { type: "someday" })
    await expect(taskService.decide(task.id, { type: "complete" })).rejects.toThrow()
    await expect(taskService.decide("missing", { type: "complete" })).rejects.toThrow()
  })
})
