import type { Preferences } from "@/shared/models/setting.model"
import { getPeriods, getPoints, pointBounds, withPoint } from "../libs/preferences"
import { timeSelectModel } from "../libs/time-slots"
import { useChangeTheme } from "./change-theme.hook"
import { useToggleSound } from "./toggle-sound.hook"
import { useUpdatePreferences } from "./update-preferences.hook"

export function usePreferencesScreen(preferences: Preferences) {
  const { update, state } = useUpdatePreferences()
  const { theme, changeTheme } = useChangeTheme()
  const { enabled: soundOn, toggle: toggleSound } = useToggleSound()
  const points = getPoints(preferences)
  return {
    state,
    theme,
    changeTheme,
    soundOn,
    toggleSound,
    points,
    periods: getPeriods(preferences),
    maxEssentialTasks: preferences.maxEssentialTasks,
    timeField: (index: number) => {
      const { min, max } = pointBounds(preferences, index)
      return timeSelectModel(points[index], (value) => update(withPoint(preferences, index, value)), min, max)
    },
    changeMaxEssential: (value: number) => update({ ...preferences, maxEssentialTasks: value }),
  }
}

export type PreferencesScreen = ReturnType<typeof usePreferencesScreen>
