import { useCallback } from "react";
import { sectionService } from "@/services/section.service";
import { DUPLICATE_SECTION, isDuplicateSectionName } from "../lib/section-name";

export function useCreateSection(projectId: string) {
  return useCallback(
    async (name: string) => {
      if (await isDuplicateSectionName(projectId, name)) return DUPLICATE_SECTION;
      return sectionService.create({ projectId, name });
    },
    [projectId]
  );
}
