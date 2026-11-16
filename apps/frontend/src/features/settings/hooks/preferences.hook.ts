import { useEffect } from "react"
import { getPreferencesAdapter } from "../adapters/get-preferences.adapter"
import { defaultPreferences } from "../libs/preferences"
import { useSettingsStore } from "../store/settings.store"
import type { Preferences } from "@/shared/models/setting.model"

export async function loadPreferences(): Promise<Preferences> {
  const stored = useSettingsStore.getState().preferences
  if (stored) return stored
  const result = await getPreferencesAdapter()
  if (!result.ok) return defaultPreferences
  useSettingsStore.getState().setPreferences(result.data)
  return result.data
}

export function usePreferences() {
  const preferences = useSettingsStore((state) => state.preferences)
  useEffect(() => {
    if (!preferences) void loadPreferences()
  }, [preferences])
  return { preferences: preferences ?? undefined }
}
