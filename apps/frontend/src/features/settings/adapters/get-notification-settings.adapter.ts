import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { NotificationSettings } from "@/shared/models/setting.model"
import { defaultNotificationSettings, isTime } from "../libs/preferences"
import { getNotificationSettingsService } from "../services/get-notification-settings.service"
import { notificationsCache } from "./settings.cache"

function toNotificationSettings(value: unknown): NotificationSettings {
  const stored = (value ?? {}) as Partial<NotificationSettings>
  return {
    inboxReminderEnabled:
      typeof stored.inboxReminderEnabled === "boolean"
        ? stored.inboxReminderEnabled
        : defaultNotificationSettings.inboxReminderEnabled,
    inboxReminderTime: isTime(stored.inboxReminderTime)
      ? stored.inboxReminderTime
      : defaultNotificationSettings.inboxReminderTime,
    onlyWhenInboxHasItems:
      typeof stored.onlyWhenInboxHasItems === "boolean"
        ? stored.onlyWhenInboxHasItems
        : defaultNotificationSettings.onlyWhenInboxHasItems,
  }
}

export async function getNotificationSettingsAdapter(): Promise<Result<NotificationSettings>> {
  const cached = notificationsCache.get("current")
  if (cached) return success(cached)
  const result = await guard(
    async () => toNotificationSettings((await getNotificationSettingsService())?.value),
    "No se pudieron cargar las notificaciones."
  )
  if (result.ok) notificationsCache.set("current", result.data)
  return result
}
