import { useCallback } from "react";
import type { Section } from "@/models/section.model";
import { sectionService } from "@/services/section.service";
import { DUPLICATE_SECTION, isDuplicateSectionName } from "../lib/section-name";

export function useRenameSection() {
  return useCallback(async (section: Section, name: string) => {
    if (await isDuplicateSectionName(section.projectId, name, section.id)) return DUPLICATE_SECTION;
    await sectionService.update(section.id, { name });
  }, []);
}
