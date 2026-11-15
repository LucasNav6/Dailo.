import { useCallback } from "react";
import { taskService } from "@/services/task.service";

export function useDiscardIdea() {
  return useCallback(async (id: string) => {
    await taskService.update(id, { status: "discarded" });
  }, []);
}
