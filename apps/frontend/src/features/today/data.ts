import type { WeekDay } from "@/components/molecules/week-strip";

export const TODAY = new Date(2026, 10, 15);

export const NOVEMBER_LOADS: Record<number, 1 | 2 | 3> = { 16: 3, 17: 2, 19: 1, 21: 2, 23: 1, 25: 2, 30: 1 };

const WEEK = [
  { letter: "D", number: 15, label: "Domingo 15" },
  { letter: "L", number: 16, label: "Lunes 16" },
  { letter: "M", number: 17, label: "Martes 17" },
  { letter: "M", number: 18, label: "Miércoles 18" },
  { letter: "J", number: 19, label: "Jueves 19" },
  { letter: "V", number: 20, label: "Viernes 20" },
  { letter: "S", number: 21, label: "Sábado 21" },
];

export function weekDays(selected: number, withLoad = true): WeekDay[] {
  return WEEK.map((day) => ({ ...day, selected: day.number === selected, load: withLoad ? (NOVEMBER_LOADS[day.number] ?? 0) : 0 }));
}
