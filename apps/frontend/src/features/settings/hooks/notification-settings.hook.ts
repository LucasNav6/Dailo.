import { useEffect } from "react"
import { getNotificationSettingsAdapter } from "../adapters/get-notification-settings.adapter"
import { useSettingsStore } from "../store/settings.store"

export function useNotificationSettings() {
  const settings = useSettingsStore((state) => state.notifications)
  useEffect(() => {
    if (settings) return
    void getNotificationSettingsAdapter().then((result) => {
      if (result.ok) useSettingsStore.getState().setNotifications(result.data)
    })
  }, [settings])
  return { settings: settings ?? undefined }
}
