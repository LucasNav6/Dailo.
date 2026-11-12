import { clearAllData } from "@/adapters/database"
import { settingAdapter } from "@/adapters/setting.adapter"
import type {
  DayPeriod,
  FieldErrors,
  NotificationSettings,
  Preferences,
  TimeRange,
} from "@/models/setting.model"

const PREFERENCES_KEY = "preferences"
const NOTIFICATIONS_KEY = "notifications"
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const PERIODS: { id: DayPeriod; label: string }[] = [
  { id: "morning", label: "Mañana" },
  { id: "noon", label: "Mediodía" },
  { id: "afternoon", label: "Tarde" },
  { id: "night", label: "Noche" },
]

export const MIN_ESSENTIAL_TASKS = 1
export const MAX_ESSENTIAL_TASKS = 5

export const defaultPreferences: Preferences = {
  workday: { start: "07:00", end: "22:00" },
  periods: {
    morning: { start: "07:00", end: "12:00" },
    noon: { start: "12:00", end: "15:00" },
    afternoon: { start: "15:00", end: "19:00" },
    night: { start: "19:00", end: "22:00" },
  },
  maxEssentialTasks: 3,
}

export const defaultNotificationSettings: NotificationSettings = {
  inboxReminderEnabled: false,
  inboxReminderTime: "21:00",
  onlyWhenInboxHasItems: true,
}

const isTime = (value: unknown): value is string =>
  typeof value === "string" && TIME_PATTERN.test(value)

function rangeOr(value: unknown, fallback: TimeRange): TimeRange {
  const range = value as Partial<TimeRange> | null | undefined
  return isTime(range?.start) && isTime(range?.end)
    ? { start: range.start, end: range.end }
    : fallback
}

/** Valida un rango dentro del mismo día (inicio estrictamente anterior al fin). */
function validateRange(
  range: TimeRange,
  field: string,
  errors: FieldErrors
): boolean {
  if (!isTime(range.start) || !isTime(range.end)) {
    errors[field] = "Indica una hora de inicio y una de fin."
    return false
  }
  if (range.start >= range.end) {
    errors[field] = "El inicio debe ser anterior al fin."
    return false
  }
  return true
}

export function validatePreferences(preferences: Preferences): FieldErrors {
  const errors: FieldErrors = {}
  validateRange(preferences.workday, "workday", errors)

  const valid = PERIODS.filter(({ id }) =>
    validateRange(preferences.periods[id], id, errors)
  )
  // Con los inicios ordenados, basta comparar cada franja con la siguiente.
  const sorted = [...valid].sort((a, b) =>
    preferences.periods[a.id].start.localeCompare(preferences.periods[b.id].start)
  )
  sorted.forEach((current, index) => {
    const next = sorted[index + 1]
    if (next && preferences.periods[current.id].end > preferences.periods[next.id].start) {
      errors[next.id] ??= `Se superpone con ${current.label.toLowerCase()}.`
    }
  })

  const max = preferences.maxEssentialTasks
  if (!Number.isInteger(max) || max < MIN_ESSENTIAL_TASKS || max > MAX_ESSENTIAL_TASKS) {
    errors.maxEssentialTasks = `Elige un valor entre ${MIN_ESSENTIAL_TASKS} y ${MAX_ESSENTIAL_TASKS}.`
  }
  return errors
}

export function validateNotificationSettings(
  settings: NotificationSettings
): FieldErrors {
  return isTime(settings.inboxReminderTime)
    ? {}
    : { inboxReminderTime: "Indica una hora válida." }
}

/** Combina lo almacenado con los valores predeterminados, descartando lo inválido. */
function normalizePreferences(value: unknown): Preferences {
  const stored = (value ?? {}) as Partial<Preferences>
  const candidate: Preferences = {
    workday: rangeOr(stored.workday, defaultPreferences.workday),
    periods: {
      morning: rangeOr(stored.periods?.morning, defaultPreferences.periods.morning),
      noon: rangeOr(stored.periods?.noon, defaultPreferences.periods.noon),
      afternoon: rangeOr(stored.periods?.afternoon, defaultPreferences.periods.afternoon),
      night: rangeOr(stored.periods?.night, defaultPreferences.periods.night),
    },
    maxEssentialTasks:
      typeof stored.maxEssentialTasks === "number"
        ? stored.maxEssentialTasks
        : defaultPreferences.maxEssentialTasks,
  }
  return Object.keys(validatePreferences(candidate)).length === 0
    ? candidate
    : defaultPreferences
}

function normalizeNotifications(value: unknown): NotificationSettings {
  const stored = (value ?? {}) as Partial<NotificationSettings>
  return {
    inboxReminderEnabled:
      typeof stored.inboxReminderEnabled === "boolean"
        ? stored.inboxReminderEnabled
        : defaultNotificationSettings.inboxReminderEnabled,
    inboxReminderTime: isTime(stored.inboxReminderTime)
      ? stored.inboxReminderTime
      : defaultNotificationSettings.inboxReminderTime,
    onlyWhenInboxHasItems:
      typeof stored.onlyWhenInboxHasItems === "boolean"
        ? stored.onlyWhenInboxHasItems
        : defaultNotificationSettings.onlyWhenInboxHasItems,
  }
}

export const settingService = {
  getPreferences: async () =>
    normalizePreferences((await settingAdapter.get(PREFERENCES_KEY))?.value),

  /** Guarda solo si es válido; devuelve los errores si no lo es. */
  savePreferences: async (preferences: Preferences): Promise<FieldErrors> => {
    const errors = validatePreferences(preferences)
    if (Object.keys(errors).length === 0)
      await settingAdapter.set(PREFERENCES_KEY, preferences)
    return errors
  },

  getNotificationSettings: async () =>
    normalizeNotifications((await settingAdapter.get(NOTIFICATIONS_KEY))?.value),

  saveNotificationSettings: async (
    settings: NotificationSettings
  ): Promise<FieldErrors> => {
    const errors = validateNotificationSettings(settings)
    if (Object.keys(errors).length === 0)
      await settingAdapter.set(NOTIFICATIONS_KEY, settings)
    return errors
  },

  /** Elimina todos los datos locales; los ajustes vuelven a sus valores predeterminados. */
  deleteAllData: () => clearAllData(),
}
