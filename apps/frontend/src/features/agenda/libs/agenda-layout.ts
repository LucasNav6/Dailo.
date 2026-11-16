import type { TimeOfDay } from "@/shared/models/task.model"

export const PERIODS: { key: TimeOfDay; title: string }[] = [
  { key: "morning", title: "Mañana" },
  { key: "midday", title: "Mediodía" },
  { key: "afternoon", title: "Tarde" },
  { key: "evening", title: "Noche" },
]

export const hours = (value: string) => (value.endsWith(":00") ? value.slice(0, 2) : value)

export const loadOf = (count: number): 0 | 1 | 2 | 3 => (count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3)
