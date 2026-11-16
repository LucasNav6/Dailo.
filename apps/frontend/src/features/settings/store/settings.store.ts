import { create } from "zustand"
import { registerReset } from "@/shared/libs/reset"
import type { NotificationSettings, Preferences } from "@/shared/models/setting.model"

type SettingsState = {
  preferences: Preferences | null
  notifications: NotificationSettings | null
  setPreferences: (preferences: Preferences) => void
  setNotifications: (notifications: NotificationSettings) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  preferences: null,
  notifications: null,
  setPreferences: (preferences) => set({ preferences }),
  setNotifications: (notifications) => set({ notifications }),
  reset: () => set({ preferences: null, notifications: null }),
}))

registerReset(() => useSettingsStore.getState().reset())
