import { useCallback } from "react";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";

/** Elimina un proyecto; con `moveToInbox` las tareas pendientes vuelven al Inbox en vez de borrarse. */
export function useDeleteProject() {
  return useCallback(async (id: string, moveToInbox: boolean) => {
    if (moveToInbox) {
      const own = (await taskService.findAll()).filter((task) => task.projectId === id);
      for (const task of own) {
        if (task.status !== "active" && task.status !== "someday") continue;
        // Las subtareas siguen a su tarea: solo pierden el proyecto.
        await taskService.update(
          task.id,
          task.parentId
            ? { projectId: undefined, sectionId: undefined }
            : { status: "inbox", projectId: undefined, sectionId: undefined, plannedDate: undefined, timeOfDay: undefined }
        );
      }
    }
    await projectService.remove(id);
  }, []);
}
