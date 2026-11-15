import { useCallback } from "react";
import { attachmentService } from "@/services/attachment.service";

export function useRemoveAttachment() {
  return useCallback(async (id: string) => {
    await attachmentService.remove(id);
  }, []);
}
