export interface Setting {
  key: string
  value: unknown
}

/** Hora local en formato "HH:MM". */
export type TimeOfDay = string

export interface TimeRange {
  start: TimeOfDay
  end: TimeOfDay
}

export type DayPeriod = "morning" | "noon" | "afternoon" | "night"

export interface Preferences {
  workday: TimeRange
  periods: Record<DayPeriod, TimeRange>
  /** Máximo de tareas esenciales por día (1–5). */
  maxEssentialTasks: number
}

export interface NotificationSettings {
  inboxReminderEnabled: boolean
  inboxReminderTime: TimeOfDay
  /** Recordar solo si Inbox tiene elementos pendientes. */
  onlyWhenInboxHasItems: boolean
}

/** Mensajes de error por campo; vacío si los datos son válidos. */
export type FieldErrors = Record<string, string>
