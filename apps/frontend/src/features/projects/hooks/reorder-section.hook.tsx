import { useCallback } from "react";
import { sectionService } from "@/services/section.service";

export function useReorderSections() {
  return useCallback(async (orderedIds: string[]) => {
    for (const [position, id] of orderedIds.entries()) await sectionService.update(id, { position });
  }, []);
}
