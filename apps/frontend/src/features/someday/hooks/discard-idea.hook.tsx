import { useCallback } from "react";
import { taskService } from "@/services/task.service";

/** Descarta una idea de Tal vez (queda recuperable en Descartados). */
export function useDiscardIdea() {
  return useCallback(async (id: string) => {
    await taskService.update(id, { status: "discarded" });
  }, []);
}
