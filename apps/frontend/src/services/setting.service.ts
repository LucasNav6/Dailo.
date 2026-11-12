import { clearAllData } from "@/adapters/database"
import { settingAdapter } from "@/adapters/setting.adapter"
import type {
  DayPeriod,
  FieldErrors,
  PeriodBreaks,
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
  periodBreaks: ["12:00", "15:00", "19:00"],
  maxEssentialTasks: 3,
}

/** Granularidad de los horarios, en minutos. */
export const TIME_STEP = 5
export const LAST_MINUTE_OF_DAY = 23 * 60 + 55

export const defaultNotificationSettings: NotificationSettings = {
  inboxReminderEnabled: false,
  inboxReminderTime: "21:00",
  onlyWhenInboxHasItems: true,
}

const isTime = (value: unknown): value is string =>
  typeof value === "string" && TIME_PATTERN.test(value)

export const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/** Puntos de la rutina en orden: inicio, tres límites y cierre. */
export const getPoints = (preferences: Preferences): string[] => [
  preferences.workday.start,
  ...preferences.periodBreaks,
  preferences.workday.end,
]

export function withPoint(preferences: Preferences, index: number, value: string): Preferences {
  const points = getPoints(preferences)
  points[index] = value
  return {
    ...preferences,
    workday: { start: points[0], end: points[4] },
    periodBreaks: [points[1], points[2], points[3]] as PeriodBreaks,
  }
}

/** Rango (en minutos) que puede tomar un punto sin invadir a sus vecinos. */
export function pointBounds(preferences: Preferences, index: number) {
  const points = getPoints(preferences)
  return {
    min: index === 0 ? 0 : toMinutes(points[index - 1]) + TIME_STEP,
    max: index === 4 ? LAST_MINUTE_OF_DAY : toMinutes(points[index + 1]) - TIME_STEP,
  }
}

/** Franjas derivadas: contiguas y que cubren exactamente la jornada. */
export function getPeriods(preferences: Preferences): Record<DayPeriod, TimeRange> {
  const [start, first, second, third, end] = getPoints(preferences)
  return {
    morning: { start, end: first },
    noon: { start: first, end: second },
    afternoon: { start: second, end: third },
    night: { start: third, end },
  }
}

/** Defensa para datos no generados por la UI: los puntos deben ser válidos y crecientes. */
export function validatePreferences(preferences: Preferences): FieldErrors {
  const errors: FieldErrors = {}
  const points = getPoints(preferences)
  const increasing =
    points.every(isTime) &&
    points.every((point, index) => index === 0 || toMinutes(point) > toMinutes(points[index - 1]))
  if (!increasing) errors.schedule = "La rutina debe tener horarios válidos y en orden."

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
    workday: isTime(stored.workday?.start) && isTime(stored.workday?.end)
      ? { start: stored.workday.start, end: stored.workday.end }
      : defaultPreferences.workday,
    periodBreaks:
      Array.isArray(stored.periodBreaks) && stored.periodBreaks.length === 3 && stored.periodBreaks.every(isTime)
        ? ([...stored.periodBreaks] as PeriodBreaks)
        : defaultPreferences.periodBreaks,
    maxEssentialTasks:
      typeof stored.maxEssentialTasks === "number"
        ? stored.maxEssentialTasks
        : defaultPreferences.maxEssentialTasks,
  }
  const errors = validatePreferences(candidate)
  return {
    workday: errors.schedule ? defaultPreferences.workday : candidate.workday,
    periodBreaks: errors.schedule ? defaultPreferences.periodBreaks : candidate.periodBreaks,
    maxEssentialTasks: errors.maxEssentialTasks
      ? defaultPreferences.maxEssentialTasks
      : candidate.maxEssentialTasks,
  }
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
