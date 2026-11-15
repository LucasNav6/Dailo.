import { useLiveQuery } from "dexie-react-hooks";
import { projectService } from "@/services/project.service";

/** Un proyecto reactivo: `undefined` mientras carga y `null` si no existe. */
export function useProject(id: string) {
  return useLiveQuery(async () => (await projectService.findById(id)) ?? null, [id]);
}
