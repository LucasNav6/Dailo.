import { useEffect, useState, type KeyboardEvent } from "react"
import { useLocation, useNavigate } from "react-router"
import {
  byPosition,
  taskDates,
  useAddTask,
  useCompleteTaskWithSubtasks,
  useDeleteTask,
  useReorderTasks,
  useSetTaskDone,
  useTasks,
} from "@/features/tasks"
import { useDragSort } from "@/shared/hooks/use-drag-sort.hook"
import { useRecentlyCompleted } from "@/shared/hooks/use-recently-completed.hook"
import type { Section } from "@/shared/models/section.model"
import type { Task } from "@/shared/models/task.model"
import { NO_SECTION } from "../libs/name-rules"
import { useCreateSection } from "./create-section.hook"
import { useDeleteProject } from "./delete-project.hook"
import { useDeleteSection, type DeleteSectionMode } from "./delete-section.hook"
import { useProject } from "./get-project.hook"
import { useSections } from "./list-sections.hook"
import { useRenameSection } from "./rename-section.hook"
import { useReorderSections } from "./reorder-sections.hook"
import { useUpdateProject } from "./update-project.hook"

type Adding = false | { sectionId?: string }

const moveItem = <T,>(list: T[], from: number, to: number) => {
  const next = [...list]
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}

const toggled = (list: string[], value: string) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

export function useProjectDetailPage(id: string) {
  const navigate = useNavigate()
  const location = useLocation()
  const { project, isLoading: loadingProject } = useProject(id)
  const { tasks, isLoading: loadingTasks } = useTasks()
  const { sections } = useSections(id)
  const addTaskToProject = useAddTask(id)
  const setTaskDone = useSetTaskDone()
  const completeWithSubtasks = useCompleteTaskWithSubtasks()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const createSection = useCreateSection(id)
  const renameSection = useRenameSection()
  const deleteSection = useDeleteSection()
  const deleteTask = useDeleteTask()
  const reorderTasks = useReorderTasks()
  const reorderSections = useReorderSections()
  const { isRecent, markCompleted } = useRecentlyCompleted()
  const [expanded, setExpanded] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [showDone, setShowDone] = useState(false)
  const [adding, setAdding] = useState<Adding>((location.state as { addTask?: boolean } | null)?.addTask ? {} : false)
  const [editing, setEditing] = useState(false)
  const [menu, setMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [moveToInbox, setMoveToInbox] = useState(true)
  const [pendingParent, setPendingParent] = useState<Task | null>(null)
  const [sectionSheet, setSectionSheet] = useState<"new" | Section | null>(null)
  const [sectionMenu, setSectionMenu] = useState<Section | null>(null)
  const [sectionDelete, setSectionDelete] = useState<Section | null>(null)
  const [subtaskToDelete, setSubtaskToDelete] = useState<Task | null>(null)
  const [deleteMode, setDeleteMode] = useState<DeleteSectionMode>("keep")

  useEffect(() => {
    if (adding) window.history.replaceState({}, "")
  }, [adding])

  const own = tasks.filter((task) => task.projectId === id && (task.status === "active" || task.status === "completed"))
  const roots = own.filter((task) => !task.parentId).sort(byPosition)
  const pending = roots.filter((task) => task.status === "active" || isRecent(task.id))
  const completed = roots
    .filter((task) => task.status === "completed" && !isRecent(task.id))
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
  const subtasksOf = (task: Task) => own.filter((sub) => sub.parentId === task.id).sort(byPosition)
  const sectionIds = new Set(sections.map((section) => section.id))
  const groupOf = (task: Task) => (task.sectionId && sectionIds.has(task.sectionId) ? task.sectionId : NO_SECTION)
  const inGroup = (group: string) => pending.filter((task) => groupOf(task) === group)
  const realSection = (group: string) => (group === NO_SECTION ? undefined : group)

  const taskDrag = useDragSort({
    onDrop: (taskId, _from, target) => {
      const ordered = inGroup(target.group).filter((task) => task.id !== taskId).map((task) => task.id)
      ordered.splice(target.index, 0, taskId)
      void reorderTasks(ordered, realSection(target.group), taskId)
    },
  })
  const sectionDrag = useDragSort({
    onDrop: (sectionId, _from, target) => {
      const ordered = sections.filter((section) => section.id !== sectionId).map((section) => section.id)
      ordered.splice(target.index, 0, sectionId)
      void reorderSections(ordered)
    },
  })
  const taskDragging = taskDrag.drag !== null
  const sectionDragging = sectionDrag.drag !== null

  const sectionTasks = (section: Section) => roots.filter((task) => task.sectionId === section.id)
  const addingSection = adding ? sections.find((section) => section.id === adding.sectionId) : undefined

  const nudge = (event: KeyboardEvent, count: number, from: number, apply: (to: number) => void) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const to = from + (event.key === "ArrowUp" ? -1 : 1)
    if (to < 0 || to >= count) return
    apply(to)
  }

  const closeSectionMenuThen = (action: () => void) => () => {
    action()
    setSectionMenu(null)
  }

  return {
    isLoading: loadingProject || loadingTasks,
    project,
    projectMissing: !loadingProject && project === null,
    sections,
    roots,
    pending,
    completed,
    taskDrag,
    sectionDrag,
    taskDragging,
    sectionDragging,
    showDone,
    adding,
    addingSection,
    editing,
    menu,
    confirmDelete,
    moveToInbox,
    pendingParent,
    pendingParentCount: pendingParent ? subtasksOf(pendingParent).filter((sub) => sub.status === "active").length : 0,
    sectionSheet,
    sectionMenu,
    sectionMenuCount: sectionMenu ? inGroup(sectionMenu.id).length : 0,
    sectionDelete,
    sectionDeleteCount: sectionDelete ? sectionTasks(sectionDelete).length : 0,
    subtaskToDelete,
    deleteMode,
    setDeleteMode,
    setMoveToInbox,
    setShowDone: () => setShowDone((value) => !value),
    openAdding: (sectionId?: string) => setAdding({ sectionId }),
    closeAdding: () => setAdding(false),
    setEditing,
    setMenu,
    setConfirmDelete,
    setSectionSheet,
    setSectionMenu,
    setSectionDelete,
    setSubtaskToDelete,
    setPendingParent,
    isExpanded: (taskId: string) => expanded.includes(taskId) && !taskDragging,
    toggleExpanded: (taskId: string) => setExpanded((current) => toggled(current, taskId)),
    isCollapsed: (sectionId: string) => collapsed.includes(sectionId),
    toggleCollapsed: (sectionId: string) => setCollapsed((current) => toggled(current, sectionId)),
    countInGroup: (group: string) => inGroup(group).length,
    rowState: (task: Task) => {
      const dragged = taskDrag.drag?.id === task.id
      return {
        subs: subtasksOf(task),
        dragged,
        dimmed: sectionDragging || (taskDragging && !dragged),
        dates: taskDates(task),
      }
    },
    taskLayout: (group: string) => {
      const list = inGroup(group)
      const draggedId = taskDrag.drag?.id
      const others = list.filter((task) => task.id !== draggedId)
      const indicatorHere = taskDrag.target?.group === group
      const out: ({ kind: "indicator" } | { kind: "task"; task: Task })[] = []
      let seen = 0
      for (const task of list) {
        if (task.id !== draggedId) {
          if (indicatorHere && taskDrag.target?.index === seen) out.push({ kind: "indicator" })
          seen++
        }
        out.push({ kind: "task", task })
      }
      if (indicatorHere && (taskDrag.target?.index ?? 0) >= others.length) out.push({ kind: "indicator" })
      return out
    },
    sectionLayout: () => {
      const draggedId = sectionDrag.drag?.id
      const others = sections.filter((section) => section.id !== draggedId)
      const indicatorAt = sectionDrag.target?.index
      const out: ({ kind: "indicator"; key: string } | { kind: "section"; section: Section })[] = []
      let seen = 0
      for (const section of sections) {
        if (section.id !== draggedId) {
          if (sectionDragging && indicatorAt === seen) out.push({ kind: "indicator", key: `i-${section.id}` })
          seen++
        }
        out.push({ kind: "section", section })
      }
      if (sectionDragging && (indicatorAt ?? 0) >= others.length) out.push({ kind: "indicator", key: "i-end" })
      return out
    },
    toggleDone: (task: Task, done: boolean) => {
      if (done && subtasksOf(task).some((sub) => sub.status === "active")) return setPendingParent(task)
      if (done) markCompleted(task.id)
      void setTaskDone(task.id, done)
    },
    toggleSubtask: (subId: string, done: boolean) => void setTaskDone(subId, done),
    completeAll: async (withSubtasks: boolean) => {
      if (!pendingParent) return
      markCompleted(pendingParent.id)
      await completeWithSubtasks(pendingParent, subtasksOf(pendingParent), withSubtasks)
      setPendingParent(null)
    },
    nudgeTask: (task: Task, group: string, event: KeyboardEvent) => {
      const list = inGroup(group)
      nudge(event, list.length, list.findIndex((item) => item.id === task.id), (to) => {
        const from = list.findIndex((item) => item.id === task.id)
        void reorderTasks(moveItem(list, from, to).map((item) => item.id), realSection(group), task.id)
      })
    },
    nudgeSection: (section: Section, event: KeyboardEvent) => {
      const from = sections.findIndex((item) => item.id === section.id)
      nudge(event, sections.length, from, (to) => void reorderSections(moveItem(sections, from, to).map((item) => item.id)))
    },
    addTask: async (title: string, description: string) => {
      if (!adding) return
      const result = await addTaskToProject(title, description, adding.sectionId)
      if (!result.ok) return result.error
      setAdding(false)
    },
    saveSection: async (name: string) => {
      if (!sectionSheet) return
      const result = sectionSheet === "new" ? await createSection(name) : await renameSection(sectionSheet, name)
      if (!result.ok) return result.error
      setSectionSheet(null)
    },
    saveProject: async (title: string, description: string) => {
      if (!project) return
      const result = await updateProject(project.id, title, description)
      if (!result.ok) return result.error
      setEditing(false)
    },
    confirmDeleteSection: async () => {
      if (sectionDelete) await deleteSection(sectionDelete.id, deleteMode)
      setSectionDelete(null)
    },
    confirmDeleteProject: async () => {
      if (!project) return
      const result = await deleteProject(project.id, moveToInbox)
      if (result.ok) navigate("/projects", { replace: true })
    },
    confirmDeleteSubtask: async () => {
      if (subtaskToDelete) await deleteTask(subtaskToDelete.id)
      setSubtaskToDelete(null)
    },
    menuRenameSection: closeSectionMenuThen(() => setSectionSheet(sectionMenu)),
    menuAddTaskToSection: closeSectionMenuThen(() => setAdding({ sectionId: sectionMenu?.id })),
    menuToggleSection: closeSectionMenuThen(() => sectionMenu && setCollapsed((current) => toggled(current, sectionMenu.id))),
    menuDeleteSection: closeSectionMenuThen(() => {
      setDeleteMode("keep")
      setSectionDelete(sectionMenu)
    }),
    openTask: (taskId: string) => navigate(`/projects/${id}/tasks/${taskId}`),
    goProjects: () => navigate("/projects"),
  }
}

export type ProjectDetailPageState = ReturnType<typeof useProjectDetailPage>
