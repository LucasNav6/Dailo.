import { db } from "@/shared/services/database"

export const saveNotificationSettingsService = (value: unknown) => db.settings.put({ key: "notifications", value })
