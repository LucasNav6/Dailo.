import { useLiveQuery } from "dexie-react-hooks";
import { settingService } from "@/services/setting.service";

/** Ajustes de notificaciones reactivos; `undefined` mientras cargan. */
export function useNotificationSettings() {
  return { settings: useLiveQuery(() => settingService.getNotificationSettings()) };
}
