import { useLiveQuery } from "dexie-react-hooks";
import { taskService } from "@/services/task.service";

export function useTask(id: string) {
  return useLiveQuery(async () => (await taskService.findById(id)) ?? null, [id]);
}
