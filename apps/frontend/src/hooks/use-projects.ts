import { useLiveQuery } from "dexie-react-hooks"
import { projectService } from "@/services/project.service"

/** Proyectos reactivos (ordenados, con progreso) y sus acciones. */
export function useProjects() {
  const projects = useLiveQuery(() => projectService.findAllWithProgress())
  return {
    projects: projects ?? [],
    isLoading: projects === undefined,
    createProject: projectService.create,
    updateProject: projectService.update,
    removeProject: projectService.remove,
  }
}
