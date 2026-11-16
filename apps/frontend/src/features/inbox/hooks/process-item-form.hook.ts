import { useState, type FormEvent } from "react"
import { useProjects } from "@/features/projects"
import type { Result } from "@/shared/models/result.model"
import type { Task, TimeOfDay } from "@/shared/models/task.model"
import { NO_PROJECT, type InboxDecision } from "../libs/inbox-decisions"
import { useEditItem } from "./edit-item.hook"
import { useProcessItem } from "./process-item.hook"

export function useProcessItemForm(task: Task, onClose: () => void) {
  const editItem = useEditItem()
  const processItem = useProcessItem()
  const { projects } = useProjects()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? "")
  const [projectId, setProjectId] = useState<string>(NO_PROJECT)
  const [plannedDate, setPlannedDate] = useState("")
  const [timeOfDay, setTimeOfDay] = useState<string>(NO_PROJECT)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  const edits = { title, description: description.trim() ? description.trim() : undefined }
  const dirty = title !== task.title || (edits.description ?? "") !== (task.description ?? "")
  const canDecide = title.trim().length > 0 && !busy

  const run = async (action: () => Promise<Result<unknown>>) => {
    setBusy(true)
    setError(false)
    const result = await action()
    setBusy(false)
    if (!result.ok) setError(true)
    return result.ok
  }

  const save = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!dirty || !canDecide) return
    await run(() => editItem(task.id, edits))
  }

  const resolve = async (decision: InboxDecision) => {
    if (await run(() => processItem(task.id, decision, edits))) onClose()
  }

  return {
    projects,
    title,
    setTitle,
    description,
    setDescription,
    projectId,
    setProjectId,
    plannedDate,
    setPlannedDate,
    timeOfDay,
    setTimeOfDay,
    error,
    canDecide,
    save,
    resolve,
    activate: () =>
      resolve({
        type: "activate",
        projectId: projectId === NO_PROJECT ? undefined : projectId,
        plannedDate: plannedDate || undefined,
        timeOfDay: timeOfDay === NO_PROJECT ? undefined : (timeOfDay as TimeOfDay),
      }),
  }
}
