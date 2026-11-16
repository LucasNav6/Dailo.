import type { NotificationSettings } from "@/shared/models/setting.model"
import { timeSelectModel } from "../libs/time-slots"
import { useUpdateNotificationSettings } from "./update-notification-settings.hook"

export function useNotificationsScreen(settings: NotificationSettings) {
  const { update, state, errors } = useUpdateNotificationSettings()
  return {
    state,
    errors,
    settings,
    timeField: timeSelectModel(settings.inboxReminderTime, (value) => update({ ...settings, inboxReminderTime: value })),
    toggleReminder: (checked: boolean) => update({ ...settings, inboxReminderEnabled: checked }),
    toggleOnlyWithItems: (checked: boolean) => update({ ...settings, onlyWhenInboxHasItems: checked }),
  }
}

export type NotificationsScreen = ReturnType<typeof useNotificationsScreen>
