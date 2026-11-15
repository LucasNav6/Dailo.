import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useSetTaskDeadline() {
  return useCallback(async (id: string, deadline: string | undefined) => {
    await taskService.update(id, { deadline });
  }, []);
}
