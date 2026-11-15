import { useCallback } from "react";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";

export function useDeleteProject() {
  return useCallback(async (id: string, moveToInbox: boolean) => {
    if (moveToInbox) {
      const own = (await taskService.findAll()).filter((task) => task.projectId === id);
      for (const task of own) {
        if (task.status !== "active" && task.status !== "someday") continue;
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
