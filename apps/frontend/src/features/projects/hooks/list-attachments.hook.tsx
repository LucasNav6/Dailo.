import { useLiveQuery } from "dexie-react-hooks";
import { attachmentService } from "@/services/attachment.service";

/** Adjuntos reactivos de una tarea. */
export function useAttachments(taskId: string) {
  return useLiveQuery(() => attachmentService.findByTaskId(taskId), [taskId]) ?? [];
}
