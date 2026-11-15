import { useLiveQuery } from "dexie-react-hooks";
import { settingService } from "@/services/setting.service";

export function usePreferences() {
  return { preferences: useLiveQuery(() => settingService.getPreferences()) };
}
