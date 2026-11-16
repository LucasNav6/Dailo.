import { useEffect } from "react"
import { listProjectsAdapter } from "../adapters/list-projects.adapter"
import { useProjectsStore } from "../store/projects.store"

export async function loadProjects() {
  const store = useProjectsStore.getState()
  if (store.status === "loading") return
  store.start()
  const result = await listProjectsAdapter()
  if (result.ok) useProjectsStore.getState().ready(result.data)
  else useProjectsStore.getState().fail()
}

export function useProjects() {
  const projects = useProjectsStore((state) => state.projects)
  const status = useProjectsStore((state) => state.status)

  useEffect(() => {
    if (status === "idle") void loadProjects()
  }, [status])

  return {
    projects,
    isLoading: status === "idle" || status === "loading",
    hasError: status === "error",
    reload: loadProjects,
  }
}
