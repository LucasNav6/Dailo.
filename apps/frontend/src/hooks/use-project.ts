import { useLiveQuery } from "dexie-react-hooks"
import type { TaskChanges } from "@/models/task.model"
import type { ProjectChanges } from "@/models/project.model"
import { projectService } from "@/services/project.service"
import { sectionService } from "@/services/section.service"
import { taskService } from "@/services/task.service"

/**
 * Contenido de un proyecto y sus acciones. `overview` es `undefined` mientras
 * carga y `null` si el proyecto no existe.
 */
export function useProject(projectId: string) {
  const overview = useLiveQuery(
    () => projectService.getOverview(projectId),
    [projectId]
  )

  return {
    overview,
    updateProject: (changes: ProjectChanges) =>
      projectService.update(projectId, changes),
    removeProject: () => projectService.remove(projectId),
    createTask: (title: string, sectionId?: string) =>
      taskService.create({ title, projectId, sectionId, status: "active" }),
    createSubtask: (parentId: string, title: string) =>
      taskService.createSubtask(parentId, { title }),
    updateTask: (id: string, changes: TaskChanges) =>
      taskService.update(id, changes),
    moveTask: taskService.moveToSection,
    setCompleted: taskService.setCompleted,
    discardTask: taskService.discard,
    createSection: (name: string) => sectionService.create({ projectId, name }),
    renameSection: (id: string, name: string) =>
      sectionService.update(id, { name }),
    removeSection: sectionService.remove,
    moveSection: sectionService.move,
  }
}
