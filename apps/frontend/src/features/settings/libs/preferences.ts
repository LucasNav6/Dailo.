import type {
  DayPeriod,
  FieldErrors,
  NotificationSettings,
  PeriodBreaks,
  Preferences,
  TimeRange,
} from "@/shared/models/setting.model"

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const PERIODS: { id: DayPeriod; label: string }[] = [
  { id: "morning", label: "Mañana" },
  { id: "noon", label: "Mediodía" },
  { id: "afternoon", label: "Tarde" },
  { id: "night", label: "Noche" },
]

export const MIN_ESSENTIAL_TASKS = 1
export const MAX_ESSENTIAL_TASKS = 5
export const TIME_STEP = 5
export const LAST_MINUTE_OF_DAY = 23 * 60 + 55

export const defaultPreferences: Preferences = {
  workday: { start: "07:00", end: "22:00" },
  periodBreaks: ["12:00", "15:00", "19:00"],
  maxEssentialTasks: 3,
}

export const defaultNotificationSettings: NotificationSettings = {
  inboxReminderEnabled: false,
  inboxReminderTime: "21:00",
  onlyWhenInboxHasItems: true,
}

export const isTime = (value: unknown): value is string =>
  typeof value === "string" && TIME_PATTERN.test(value)

export const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

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

export function pointBounds(preferences: Preferences, index: number) {
  const points = getPoints(preferences)
  return {
    min: index === 0 ? 0 : toMinutes(points[index - 1]) + TIME_STEP,
    max: index === 4 ? LAST_MINUTE_OF_DAY : toMinutes(points[index + 1]) - TIME_STEP,
  }
}

export function getPeriods(preferences: Preferences): Record<DayPeriod, TimeRange> {
  const [start, first, second, third, end] = getPoints(preferences)
  return {
    morning: { start, end: first },
    noon: { start: first, end: second },
    afternoon: { start: second, end: third },
    night: { start: third, end },
  }
}

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

export function validateNotificationSettings(settings: NotificationSettings): FieldErrors {
  return !settings.inboxReminderEnabled || isTime(settings.inboxReminderTime)
    ? {}
    : { inboxReminderTime: "Indica una hora válida." }
}
