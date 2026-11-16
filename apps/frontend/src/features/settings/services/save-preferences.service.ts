import { db } from "@/shared/services/database"

export const savePreferencesService = (value: unknown) => db.settings.put({ key: "preferences", value })
