import { useLiveQuery } from "dexie-react-hooks";
import { taskService } from "@/services/task.service";

/** Una tarea reactiva: `undefined` mientras carga y `null` si no existe. */
export function useTask(id: string) {
  return useLiveQuery(async () => (await taskService.findById(id)) ?? null, [id]);
}
