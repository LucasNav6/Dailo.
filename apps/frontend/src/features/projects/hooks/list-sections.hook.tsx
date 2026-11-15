import { useLiveQuery } from "dexie-react-hooks";
import { sectionService } from "@/services/section.service";

export function useSections(projectId: string) {
  const sections = useLiveQuery(
    async () => (await sectionService.findByProjectId(projectId)).sort((a, b) => a.position - b.position),
    [projectId]
  );
  return { sections: sections ?? [], isLoading: sections === undefined };
}
