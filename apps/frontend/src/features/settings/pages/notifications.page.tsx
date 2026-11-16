import type { NotificationSettings } from "@/shared/models/setting.model"
import { useNotificationSettings } from "../hooks/notification-settings.hook"
import { useNotificationsScreen } from "../hooks/notifications-screen.hook"
import { NotificationsView } from "../views/notifications.view"

function NotificationsForm({ settings }: { settings: NotificationSettings }) {
  const screen = useNotificationsScreen(settings)
  return <NotificationsView screen={screen} />
}

export function NotificationsPage() {
  const { settings } = useNotificationSettings()
  if (!settings) return null
  return <NotificationsForm settings={settings} />
}
