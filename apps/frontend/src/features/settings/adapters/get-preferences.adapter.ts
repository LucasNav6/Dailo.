import { guard, success } from "@/shared/libs/result"
import type { Result } from "@/shared/models/result.model"
import type { PeriodBreaks, Preferences } from "@/shared/models/setting.model"
import { defaultPreferences, isTime, validatePreferences } from "../libs/preferences"
import { getPreferencesService } from "../services/get-preferences.service"
import { preferencesCache } from "./settings.cache"

function toPreferences(value: unknown): Preferences {
  const stored = (value ?? {}) as Partial<Preferences>
  const candidate: Preferences = {
    workday:
      isTime(stored.workday?.start) && isTime(stored.workday?.end)
        ? { start: stored.workday.start, end: stored.workday.end }
        : defaultPreferences.workday,
    periodBreaks:
      Array.isArray(stored.periodBreaks) && stored.periodBreaks.length === 3 && stored.periodBreaks.every(isTime)
        ? ([...stored.periodBreaks] as PeriodBreaks)
        : defaultPreferences.periodBreaks,
    maxEssentialTasks:
      typeof stored.maxEssentialTasks === "number" ? stored.maxEssentialTasks : defaultPreferences.maxEssentialTasks,
  }
  const errors = validatePreferences(candidate)
  return {
    workday: errors.schedule ? defaultPreferences.workday : candidate.workday,
    periodBreaks: errors.schedule ? defaultPreferences.periodBreaks : candidate.periodBreaks,
    maxEssentialTasks: errors.maxEssentialTasks ? defaultPreferences.maxEssentialTasks : candidate.maxEssentialTasks,
  }
}

export async function getPreferencesAdapter(): Promise<Result<Preferences>> {
  const cached = preferencesCache.get("current")
  if (cached) return success(cached)
  const result = await guard(async () => toPreferences((await getPreferencesService())?.value), "No se pudieron cargar las preferencias.")
  if (result.ok) preferencesCache.set("current", result.data)
  return result
}
