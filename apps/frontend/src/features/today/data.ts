import type { WeekDay } from "@/components/molecules/week-strip";

/** Fecha congelada del diseño: domingo 15 de noviembre de 2026. */
export const TODAY = new Date(2026, 10, 15);

/** Carga de tareas por día de noviembre (1 = poca, 3 = mucha), tal como aparece en el diseño. */
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

/** Semana del 15 al 21 con el día `selected` marcado. `withLoad: false` oculta las marcas de carga. */
export function weekDays(selected: number, withLoad = true): WeekDay[] {
  return WEEK.map((day) => ({ ...day, selected: day.number === selected, load: withLoad ? (NOVEMBER_LOADS[day.number] ?? 0) : 0 }));
}
