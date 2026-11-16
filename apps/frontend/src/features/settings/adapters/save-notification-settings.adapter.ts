import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { NotificationSettings } from "@/shared/models/setting.model"
import { saveNotificationSettingsService } from "../services/save-notification-settings.service"
import { notificationsCache } from "./settings.cache"

export async function saveNotificationSettingsAdapter(settings: NotificationSettings): Promise<Result<NotificationSettings>> {
  const result = await guard(async () => {
    await saveNotificationSettingsService(settings)
    return settings
  }, "No se pudieron guardar las notificaciones.")
  if (result.ok) notificationsCache.set("current", settings)
  return result
}
