import { useState } from "react"
import { useNavigate } from "react-router"
import { useTasks } from "@/features/tasks"
import type { Project } from "@/shared/models/project.model"
import { useCreateProject } from "./create-project.hook"
import { useDeleteProject } from "./delete-project.hook"
import { useProjects } from "./list-projects.hook"
import { useUpdateProject } from "./update-project.hook"

export function useProjectsPage() {
  const navigate = useNavigate()
  const { projects, isLoading, hasError, reload } = useProjects()
  const { tasks, isLoading: loadingTasks } = useTasks()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const [composing, setComposing] = useState<Project | "new" | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [moveToInbox, setMoveToInbox] = useState(true)

  const summaries = projects.map((project) => {
    const own = tasks.filter(
      (task) => task.projectId === project.id && !task.parentId && (task.status === "active" || task.status === "completed")
    )
    const done = own.filter((task) => task.status === "completed").length
    return {
      id: project.id,
      name: project.name,
      description: project.description ?? "",
      pending: own.length - done,
      progress: own.length === 0 ? 0 : Math.round((done / own.length) * 100),
    }
  })
  const menu = projects.find((project) => project.id === menuId) ?? null
  const pendingOfDeleting = deleting ? (summaries.find((summary) => summary.id === deleting.id)?.pending ?? 0) : 0

  return {
    isLoading: isLoading || loadingTasks,
    hasError,
    reload,
    projects,
    summaries,
    composing,
    menu,
    highlighted: menu ? projects.indexOf(menu) : undefined,
    deleting,
    pendingOfDeleting,
    moveToInbox,
    setMoveToInbox,
    startCreate: () => setComposing("new"),
    closeCompose: () => setComposing(null),
    openProject: (index: number) => navigate(`/projects/${projects[index].id}`),
    openMenu: (index: number) => setMenuId(projects[index].id),
    closeMenu: () => setMenuId(null),
    editMenuProject: () => {
      setComposing(menu)
      setMenuId(null)
    },
    addTaskToMenuProject: () => {
      if (menu) navigate(`/projects/${menu.id}`, { state: { addTask: true } })
    },
    askDelete: () => {
      setDeleting(menu)
      setMenuId(null)
    },
    cancelDelete: () => setDeleting(null),
    confirmDelete: async () => {
      if (deleting) await deleteProject(deleting.id, moveToInbox)
      setDeleting(null)
    },
    save: async (title: string, description: string) => {
      const editing = composing !== "new" ? composing : null
      const result = editing ? await updateProject(editing.id, title, description) : await createProject(title, description)
      if (!result.ok) return result.error
      setComposing(null)
    },
  }
}

export type ProjectsPageState = ReturnType<typeof useProjectsPage>
