import { useLiveQuery } from "dexie-react-hooks";
import { settingService } from "@/services/setting.service";

/** Preferencias reactivas; `undefined` mientras cargan. */
export function usePreferences() {
  return { preferences: useLiveQuery(() => settingService.getPreferences()) };
}
