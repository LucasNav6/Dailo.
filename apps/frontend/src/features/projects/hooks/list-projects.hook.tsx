import { useLiveQuery } from "dexie-react-hooks"
import { projectService } from "@/services/project.service"

/** Proyectos reactivos. */
export function useProjects() {
  const projects = useLiveQuery(() => projectService.findAll())
  return { projects: projects ?? [], isLoading: projects === undefined }
}
