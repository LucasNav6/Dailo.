import { useNotify } from "@/shared/hooks/toast.hook"
import type { Preferences } from "@/shared/models/setting.model"
import { savePreferencesAdapter } from "../adapters/save-preferences.adapter"
import { validatePreferences } from "../libs/preferences"
import { useSettingsStore } from "../store/settings.store"
import { useAutoSave } from "./use-auto-save.hook"

export function useUpdatePreferences() {
  const { state, errors, run } = useAutoSave()
  const notify = useNotify()
  const update = (next: Preferences) =>
    void run(async () => {
      const invalid = validatePreferences(next)
      if (Object.keys(invalid).length > 0) return invalid
      const result = await savePreferencesAdapter(next)
      if (!result.ok) {
        notify(result.error)
        throw new Error(result.error)
      }
      useSettingsStore.getState().setPreferences(next)
      return {}
    })
  return { update, state, errors }
}
