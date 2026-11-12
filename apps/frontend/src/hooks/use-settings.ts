import { useLiveQuery } from "dexie-react-hooks"
import { settingService } from "@/services/setting.service"

/** Preferencias reactivas; `undefined` mientras cargan. */
export function usePreferences() {
  const preferences = useLiveQuery(() => settingService.getPreferences())
  return { preferences, savePreferences: settingService.savePreferences }
}

/** Ajustes de notificaciones reactivos; `undefined` mientras cargan. */
export function useNotificationSettings() {
  const settings = useLiveQuery(() => settingService.getNotificationSettings())
  return { settings, saveSettings: settingService.saveNotificationSettings }
}

export const deleteAllData = settingService.deleteAllData
