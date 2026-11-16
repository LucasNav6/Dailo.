import { useState } from "react"
import { useNavigate } from "react-router"
import { useCreateSection, useProject, useSections } from "@/features/projects"
import { dayLabel } from "@/shared/libs/dates"
import type { Section } from "@/shared/models/section.model"
import type { Task, TimeOfDay } from "@/shared/models/task.model"
import { byPosition } from "../libs/task-rules"
import { TIME_OF_DAY_OPTIONS } from "../libs/task-labels"
import { useAddSubtask } from "./add-subtask.hook"
import { useAttachFiles } from "./attach-file.hook"
import { useDeleteTask } from "./delete-task.hook"
import { useEditTask } from "./edit-task.hook"
import { useTask } from "./get-task.hook"
import { useAttachments } from "./list-attachments.hook"
import { useTasks } from "./list-tasks.hook"
import { useMoveTaskToSection } from "./move-task-to-section.hook"
import { useRemoveAttachment } from "./remove-attachment.hook"
import { useSetTaskDeadline } from "./set-task-deadline.hook"
import { useSetTaskDone } from "./set-task-done.hook"
import { useSetTaskEssential } from "./set-task-essential.hook"
import { useSetTaskPlan } from "./set-task-plan.hook"

type Dialog = "subtask" | "move" | "menu" | "delete" | null

export function useTaskDetailPage(projectId: string, taskId: string) {
  const { task, isLoading: loadingTask } = useTask(taskId)
  const { project, isLoading: loadingProject } = useProject(projectId)
  const { tasks } = useTasks()
  const attachments = useAttachments(taskId)
  const { sections } = useSections(projectId)
  const editTask = useEditTask()
  const setTaskDone = useSetTaskDone()
  const setPlan = useSetTaskPlan()
  const setDeadline = useSetTaskDeadline()
  const setEssential = useSetTaskEssential()
  const addSubtask = useAddSubtask()
  const deleteTask = useDeleteTask()
  const attachFiles = useAttachFiles()
  const removeAttachment = useRemoveAttachment()
  const createSection = useCreateSection(projectId)
  const moveToSection = useMoveTaskToSection()
  const navigate = useNavigate()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [subtaskToDelete, setSubtaskToDelete] = useState<Task | null>(null)
  const [notice, setNotice] = useState<string>()

  const subtasks = task ? tasks.filter((sub) => sub.parentId === task.id).sort(byPosition) : []
  const currentSection = task ? sections.find((section: Section) => section.id === task.sectionId) : undefined
  const periodLabel = task?.timeOfDay ? TIME_OF_DAY_OPTIONS.find((option) => option.key === task.timeOfDay)?.label : undefined
  const planLabel = task?.plannedDate ? `${dayLabel(task.plannedDate)}${periodLabel ? ` · ${periodLabel}` : ""}` : undefined

  return {
    isLoading: loadingTask || loadingProject,
    notFound: !task || task.projectId !== projectId,
    task,
    project,
    subtasks,
    doneSubtasks: subtasks.filter((sub) => sub.status === "completed").length,
    attachments,
    sections,
    currentSection,
    planLabel,
    notice,
    dialog,
    subtaskToDelete,
    openDialog: setDialog,
    closeDialog: () => setDialog(null),
    askDeleteSubtask: setSubtaskToDelete,
    editTitle: (title: string) => void editTask(taskId, { title }),
    editDescription: (description: string) => void editTask(taskId, { description }),
    changePlan: (plannedDate: string | undefined, timeOfDay?: TimeOfDay) => void setPlan(taskId, plannedDate, timeOfDay),
    changeDeadline: (deadline: string | undefined) => void setDeadline(taskId, deadline),
    toggleEssential: async (value: boolean) => {
      const result = await setEssential(taskId, value)
      setNotice(result.ok ? undefined : result.error)
    },
    toggleSubtask: (id: string, done: boolean) => void setTaskDone(id, done),
    attach: async (files: FileList | null) => {
      if (!files?.length) return
      const result = await attachFiles(taskId, [...files])
      setNotice(result.ok ? undefined : result.error)
    },
    detach: (id: string) => void removeAttachment(taskId, id),
    saveSubtask: async (title: string) => {
      if (!task) return
      const result = await addSubtask(task, title)
      if (!result.ok) return result.error
      setDialog(null)
    },
    confirmDeleteSubtask: async () => {
      if (subtaskToDelete) await deleteTask(subtaskToDelete.id)
      setSubtaskToDelete(null)
    },
    confirmDeleteTask: async () => {
      const result = await deleteTask(taskId)
      if (result.ok) navigate(`/projects/${projectId}`, { replace: true })
    },
    backToProject: () => navigate(`/projects/${projectId}`),
    goToday: () => navigate("/today"),
    move: async (sectionId: string | undefined) => {
      await moveToSection(taskId, sectionId)
      setDialog(null)
    },
    saveSection: async (name: string) => {
      const result = await createSection(name)
      return result.ok ? undefined : result.error
    },
  }
}

export type TaskDetailPageState = ReturnType<typeof useTaskDetailPage>
