import { useLiveQuery } from "dexie-react-hooks";
import { attachmentService } from "@/services/attachment.service";

export function useAttachments(taskId: string) {
  return useLiveQuery(() => attachmentService.findByTaskId(taskId), [taskId]) ?? [];
}
