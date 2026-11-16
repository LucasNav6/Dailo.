import { db } from "@/shared/services/database"

export const getNotificationSettingsService = () => db.settings.get("notifications")
