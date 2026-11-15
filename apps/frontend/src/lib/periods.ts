import {
  RiMoonLine,
  RiSunCloudyLine,
  RiSunFoggyLine,
  RiSunLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import type { DayPeriod } from "@/models/setting.model"
import type { TimeOfDay } from "@/models/task.model"

/** Las franjas de Preferencias y el `timeOfDay` guardado en la tarea son el mismo concepto. */
export const PERIOD_TIME: Record<DayPeriod, TimeOfDay> = {
  morning: "morning",
  noon: "midday",
  afternoon: "afternoon",
  night: "evening",
}

export const PERIOD_ICON: Record<DayPeriod, RemixiconComponentType> = {
  morning: RiSunFoggyLine,
  noon: RiSunLine,
  afternoon: RiSunCloudyLine,
  night: RiMoonLine,
}
