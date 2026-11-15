import { useCallback } from "react";
import { MAX_ATTACHMENT_SIZE } from "@/models/attachment.model";
import { attachmentService } from "@/services/attachment.service";

/** Adjunta archivos a una tarea. Devuelve un mensaje de error si alguno no se pudo guardar. */
export function useAttachFiles() {
  return useCallback(async (taskId: string, files: File[]) => {
    for (const file of files) {
      if (file.size > MAX_ATTACHMENT_SIZE) return `“${file.name}” supera los 10 MB.`;
      try {
        await attachmentService.add(taskId, file);
      } catch {
        return `No se pudo guardar “${file.name}”.`;
      }
    }
  }, []);
}
