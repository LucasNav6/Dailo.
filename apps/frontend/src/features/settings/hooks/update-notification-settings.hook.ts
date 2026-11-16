import { useNotify } from "@/shared/hooks/toast.hook"
import type { NotificationSettings } from "@/shared/models/setting.model"
import { saveNotificationSettingsAdapter } from "../adapters/save-notification-settings.adapter"
import { validateNotificationSettings } from "../libs/preferences"
import { useSettingsStore } from "../store/settings.store"
import { useAutoSave } from "./use-auto-save.hook"

export function useUpdateNotificationSettings() {
  const { state, errors, run } = useAutoSave()
  const notify = useNotify()
  const update = (next: NotificationSettings) =>
    void run(async () => {
      const invalid = validateNotificationSettings(next)
      if (Object.keys(invalid).length > 0) return invalid
      const result = await saveNotificationSettingsAdapter(next)
      if (!result.ok) {
        notify(result.error)
        throw new Error(result.error)
      }
      useSettingsStore.getState().setNotifications(next)
      return {}
    })
  return { update, state, errors }
}
