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

/** Límites entre mañana/mediodía, mediodía/tarde y tarde/noche. */
export type PeriodBreaks = [TimeOfDay, TimeOfDay, TimeOfDay]

/**
 * Las franjas cubren toda la jornada sin huecos ni superposiciones: la mañana
 * empieza con la jornada, la noche termina con ella y cada franja comienza
 * donde termina la anterior. Por eso solo se guardan los límites.
 */
export interface Preferences {
  workday: TimeRange
  periodBreaks: PeriodBreaks
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
