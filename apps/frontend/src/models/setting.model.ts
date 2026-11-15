export interface Setting {
  key: string
  value: unknown
}

export type TimeOfDay = string

export interface TimeRange {
  start: TimeOfDay
  end: TimeOfDay
}

export type DayPeriod = "morning" | "noon" | "afternoon" | "night"

export type PeriodBreaks = [TimeOfDay, TimeOfDay, TimeOfDay]

export interface Preferences {
  workday: TimeRange
  periodBreaks: PeriodBreaks
  maxEssentialTasks: number
}

export interface NotificationSettings {
  inboxReminderEnabled: boolean
  inboxReminderTime: TimeOfDay
  onlyWhenInboxHasItems: boolean
}

export type FieldErrors = Record<string, string>
