import { useCallback } from "react";
import { attachmentService } from "@/services/attachment.service";

/** Quita un adjunto de una tarea. */
export function useRemoveAttachment() {
  return useCallback(async (id: string) => {
    await attachmentService.remove(id);
  }, []);
}
