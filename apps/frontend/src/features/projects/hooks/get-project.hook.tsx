import { useLiveQuery } from "dexie-react-hooks";
import { projectService } from "@/services/project.service";

export function useProject(id: string) {
  return useLiveQuery(async () => (await projectService.findById(id)) ?? null, [id]);
}
