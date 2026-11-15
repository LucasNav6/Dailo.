import { useLiveQuery } from "dexie-react-hooks";
import { settingService } from "@/services/setting.service";

export function useNotificationSettings() {
  return { settings: useLiveQuery(() => settingService.getNotificationSettings()) };
}
