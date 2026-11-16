import { createCache } from "@/shared/libs/cache"
import { registerReset } from "@/shared/libs/reset"
import type { NotificationSettings, Preferences } from "@/shared/models/setting.model"

export const preferencesCache = createCache<Preferences>()
export const notificationsCache = createCache<NotificationSettings>()

registerReset(() => {
  preferencesCache.clear()
  notificationsCache.clear()
})
