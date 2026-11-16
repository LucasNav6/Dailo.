import type { Preferences } from "@/shared/models/setting.model"
import { usePreferences } from "../hooks/preferences.hook"
import { usePreferencesScreen } from "../hooks/preferences-screen.hook"
import { PreferencesView } from "../views/preferences.view"

function PreferencesForm({ preferences }: { preferences: Preferences }) {
  const screen = usePreferencesScreen(preferences)
  return <PreferencesView screen={screen} />
}

export function PreferencesPage() {
  const { preferences } = usePreferences()
  if (!preferences) return null
  return <PreferencesForm preferences={preferences} />
}
