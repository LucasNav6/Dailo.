import { db } from "@/shared/services/database"

export const getPreferencesService = () => db.settings.get("preferences")
