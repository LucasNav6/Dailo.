import { guard } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { Preferences } from "@/shared/models/setting.model"
import { savePreferencesService } from "../services/save-preferences.service"
import { preferencesCache } from "./settings.cache"

export async function savePreferencesAdapter(preferences: Preferences): Promise<Result<Preferences>> {
  const result = await guard(async () => {
    await savePreferencesService(preferences)
    return preferences
  }, "No se pudieron guardar las preferencias.")
  if (result.ok) preferencesCache.set("current", preferences)
  return result
}
