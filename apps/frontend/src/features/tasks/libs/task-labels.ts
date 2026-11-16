import type { TimeOfDay } from "@/shared/models/task.model"

export const TIME_OF_DAY_OPTIONS: { key: TimeOfDay; label: string }[] = [
  { key: "morning", label: "Mañana" },
  { key: "midday", label: "Mediodía" },
  { key: "afternoon", label: "Tarde" },
  { key: "evening", label: "Noche" },
]

export const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
