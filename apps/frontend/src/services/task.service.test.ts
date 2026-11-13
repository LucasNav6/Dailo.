import "fake-indexeddb/auto"
import { beforeEach, describe, expect, it } from "vitest"
import { clearAllData } from "@/adapters/database"
import { ValidationError } from "./errors"
import { projectService } from "./project.service"
import { sectionService } from "./section.service"
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
  it("activa con proyecto, fecha y franja, guardando las ediciones", async () => {
    const project = await projectService.create({ name: "Forky" })
    const task = await taskService.create({ title: "gastos" })

    const next = await taskService.decide(
      task.id,
      {
        type: "activate",
        projectId: project.id,
        plannedDate: "2026-11-13",
        timeOfDay: "morning",
      },
      { title: "Revisar gastos de Forky", description: "Comparar con presupuesto" }
    )

    expect(next).toMatchObject({
      status: "active",
      projectId: project.id,
      plannedDate: "2026-11-13",
      timeOfDay: "morning",
      title: "Revisar gastos de Forky",
      description: "Comparar con presupuesto",
    })
    expect(await taskService.findInbox()).toHaveLength(0)
  })

  it("activa sin fecha", async () => {
    const task = await taskService.create({ title: "x" })
    const next = await taskService.decide(task.id, { type: "activate" })
    expect(next.status).toBe("active")
    expect(next.plannedDate).toBeUndefined()
  })

  it("ignora la franja si no hay fecha", async () => {
    const task = await taskService.create({ title: "x" })
    const next = await taskService.decide(task.id, {
      type: "activate",
      timeOfDay: "evening",
    })
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
      taskService.decide(task.id, { type: "activate", plannedDate: "2026-02-31" })
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

describe("tareas de proyecto", () => {
  it("crea subtareas heredando proyecto y sección de la madre", async () => {
    const project = await projectService.create({ name: "P" })
    const section = await sectionService.create({ projectId: project.id, name: "S" })
    const parent = await taskService.create({ title: "madre", projectId: project.id, sectionId: section.id, status: "active" })
    const child = await taskService.createSubtask(parent.id, { title: " hija " })
    expect(child).toMatchObject({ title: "hija", parentId: parent.id, projectId: project.id, sectionId: section.id, status: "active", essential: false })
    await expect(taskService.createSubtask("missing", { title: "x" })).rejects.toThrow()
    await expect(taskService.createSubtask(parent.id, { title: " " })).rejects.toBeInstanceOf(ValidationError)
  })

  it("completa y reactiva manejando completedAt", async () => {
    const task = await taskService.create({ title: "t", status: "active" })
    const done = await taskService.setCompleted(task.id, true)
    expect(done.status).toBe("completed")
    expect(done.completedAt).toBeDefined()
    const reopened = await taskService.setCompleted(task.id, false)
    expect(reopened.status).toBe("active")
    expect(reopened.completedAt).toBeUndefined()
  })

  it("descarta de forma lógica la tarea y sus subtareas", async () => {
    const parent = await taskService.create({ title: "madre", status: "active" })
    const child = await taskService.createSubtask(parent.id, { title: "hija" })
    const other = await taskService.create({ title: "otra", status: "active" })
    await taskService.discard(parent.id)
    for (const id of [parent.id, child.id]) {
      const task = await taskService.findById(id)
      expect(task?.status).toBe("discarded")
      expect(task?.deletedAt).toBeDefined()
    }
    expect((await taskService.findById(other.id))?.status).toBe("active")
  })

  it("una tarea planificada para hoy sigue siendo la misma tarea del proyecto", async () => {
    const project = await projectService.create({ name: "P" })
    const task = await taskService.create({ title: "t", projectId: project.id, status: "active", plannedDate: "2026-11-13" })
    const all = await taskService.findAll()
    expect(all.filter((item) => item.id === task.id)).toHaveLength(1)
    expect((await projectService.getOverview(project.id))?.unsectioned.map((n) => n.task.id)).toEqual([task.id])
  })
})

describe("mover a sección", () => {
  it("mueve la tarea y sus subtareas, y valida la sección", async () => {
    const project = await projectService.create({ name: "P" })
    const other = await projectService.create({ name: "Otro" })
    const section = await sectionService.create({ projectId: project.id, name: "S" })
    const foreign = await sectionService.create({ projectId: other.id, name: "X" })
    const parent = await taskService.create({ title: "madre", projectId: project.id, status: "active" })
    const child = await taskService.createSubtask(parent.id, { title: "hija" })

    await taskService.moveToSection(parent.id, section.id)
    expect((await taskService.findById(parent.id))?.sectionId).toBe(section.id)
    expect((await taskService.findById(child.id))?.sectionId).toBe(section.id)

    await expect(taskService.moveToSection(parent.id, foreign.id)).rejects.toThrow()
    expect((await taskService.findById(child.id))?.sectionId).toBe(section.id)

    await taskService.moveToSection(parent.id, undefined)
    expect((await taskService.findById(child.id))?.sectionId).toBeUndefined()
  })
})

describe("Hoy", () => {
  it("incluye tareas planificadas o con deadline ese día, activas o completadas", async () => {
    await taskService.create({ title: "planificada", status: "active", plannedDate: "2026-11-13" })
    await taskService.create({ title: "vence", status: "active", deadline: "2026-11-13" })
    const done = await taskService.create({ title: "hecha", status: "active", plannedDate: "2026-11-13" })
    await taskService.setCompleted(done.id, true)
    await taskService.create({ title: "otro día", status: "active", plannedDate: "2026-11-14" })
    await taskService.create({ title: "inbox", plannedDate: "2026-11-13" })
    await taskService.create({ title: "tal vez", status: "someday", plannedDate: "2026-11-13" })

    const titles = (await taskService.findForDay("2026-11-13")).map((t) => t.title).sort()
    expect(titles).toEqual(["hecha", "planificada", "vence"])
  })

  it("elegir franja planifica la tarea para ese día", async () => {
    const task = await taskService.create({ title: "t", status: "active", deadline: "2026-11-13" })
    const next = await taskService.setTimeOfDay(task.id, "afternoon", "2026-11-13")
    expect(next).toMatchObject({ timeOfDay: "afternoon", plannedDate: "2026-11-13" })
  })
})

describe("planificar", () => {
  it("pasa a un proyecto con deadline y subtareas con su propio deadline", async () => {
    const project = await projectService.create({ name: "Trabajo" })
    const item = await taskService.create({ title: "balance" })
    const planned = await taskService.plan(item.id, {
      title: " Pedir el balance 2025 al contador ",
      description: "Para el monotributo",
      projectId: project.id,
      deadline: "2026-11-20",
      subtasks: [
        { title: "Juntar facturas", deadline: "2026-11-18" },
        { title: "  " },
        { title: "Agendar la reunión" },
      ],
    })
    expect(planned).toMatchObject({ status: "active", projectId: project.id, deadline: "2026-11-20", title: "Pedir el balance 2025 al contador", description: "Para el monotributo" })

    const overview = await projectService.getOverview(project.id)
    const children = overview?.unsectioned[0].children.map((n) => [n.task.title, n.task.deadline])
    expect(children).toEqual([["Juntar facturas", "2026-11-18"], ["Agendar la reunión", undefined]])
    expect(await taskService.findInbox()).toHaveLength(0)
  })

  it("también planifica una idea de Tal vez", async () => {
    const project = await projectService.create({ name: "P" })
    const item = await taskService.create({ title: "idea" })
    await taskService.decide(item.id, { type: "someday" })
    const planned = await taskService.plan(item.id, { title: "idea", projectId: project.id })
    expect(planned.status).toBe("active")
  })

  it("exige proyecto y título, y no guarda nada si falla", async () => {
    const project = await projectService.create({ name: "P" })
    const item = await taskService.create({ title: "x" })
    await expect(taskService.plan(item.id, { title: "x", projectId: "" })).rejects.toBeInstanceOf(ValidationError)
    await expect(taskService.plan(item.id, { title: " ", projectId: project.id, subtasks: [{ title: "s" }] })).rejects.toBeInstanceOf(ValidationError)
    await expect(taskService.plan(item.id, { title: "x", projectId: "nope" })).rejects.toThrow()
    expect((await taskService.findById(item.id))?.status).toBe("inbox")
    expect((await taskService.findAll()).length).toBe(1)
  })

  it("solo planifica elementos de Inbox o Tal vez", async () => {
    const project = await projectService.create({ name: "P" })
    const task = await taskService.create({ title: "t", status: "active" })
    await expect(taskService.plan(task.id, { title: "t", projectId: project.id })).rejects.toThrow()
  })
})

describe("restaurar y listas", () => {
  it("restaura una descartada al estado indicado y limpia deletedAt", async () => {
    const task = await taskService.create({ title: "t" })
    await taskService.discard(task.id)
    expect((await taskService.findDiscarded()).map((t) => t.id)).toEqual([task.id])
    const back = await taskService.restore(task.id, "inbox")
    expect(back.status).toBe("inbox")
    expect(back.deletedAt).toBeUndefined()
    expect(await taskService.findDiscarded()).toHaveLength(0)
  })

  it("deshacer una tarea completada limpia completedAt", async () => {
    const task = await taskService.create({ title: "t" })
    await taskService.decide(task.id, { type: "complete" })
    const back = await taskService.restore(task.id, "inbox")
    expect(back.completedAt).toBeUndefined()
    expect(back.status).toBe("inbox")
  })

  it("Tal vez lista lo más reciente primero", async () => {
    const a = await taskService.create({ title: "a" })
    await taskService.decide(a.id, { type: "someday" })
    await new Promise((resolve) => setTimeout(resolve, 3))
    const b = await taskService.create({ title: "b" })
    await taskService.decide(b.id, { type: "someday" })
    expect((await taskService.findSomeday()).map((t) => t.title)).toEqual(["b", "a"])
  })
})
