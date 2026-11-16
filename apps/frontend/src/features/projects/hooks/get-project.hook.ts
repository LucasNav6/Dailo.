import { useProjects } from "./list-projects.hook"

export function useProject(id: string) {
  const { projects, isLoading, hasError } = useProjects()
  return { project: projects.find((candidate) => candidate.id === id) ?? null, isLoading, hasError }
}
