import { LAST_MINUTE_OF_DAY, TIME_STEP, toMinutes } from "./preferences"

export const pad = (value: number) => String(value).padStart(2, "0")

export const formatMinutes = (time: number) => `${pad(Math.floor(time / 60))}:${pad(time % 60)}`

export function slotsBetween(min: number, max: number, current: number) {
  const slots = new Set<number>([current])
  for (let time = Math.ceil(min / TIME_STEP) * TIME_STEP; time <= max; time += TIME_STEP) slots.add(time)
  return [...slots].sort((a, b) => a - b)
}

export function timeOptions(value: string, min = 0, max = LAST_MINUTE_OF_DAY) {
  const current = toMinutes(value)
  const slots = slotsBetween(min, max, current)
  const hour = Math.floor(current / 60)
  return {
    current,
    hour,
    slots,
    hours: [...new Set(slots.map((slot) => Math.floor(slot / 60)))],
    minutes: slots.filter((slot) => Math.floor(slot / 60) === hour).map((slot) => slot % 60),
  }
}

export function nearestSlot(slots: number[], nextHour: number, current: number) {
  const options = slots.filter((slot) => Math.floor(slot / 60) === nextHour)
  const target = nextHour * 60 + (current % 60)
  return options.reduce((best, slot) => (Math.abs(slot - target) < Math.abs(best - target) ? slot : best))
}

export function timeSelectModel(value: string, onChange: (value: string) => void, min?: number, max?: number) {
  const { current, hour, slots, hours, minutes } = timeOptions(value, min, max)
  return {
    hour,
    minute: current % 60,
    hours,
    minutes,
    onHour: (nextHour: number) => onChange(formatMinutes(nearestSlot(slots, nextHour, current))),
    onMinute: (minute: number) => onChange(`${pad(hour)}:${pad(minute)}`),
  }
}

export type TimeSelectModel = ReturnType<typeof timeSelectModel>
