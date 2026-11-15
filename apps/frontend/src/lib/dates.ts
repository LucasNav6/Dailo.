import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

/** YYYY-MM-DD en hora local (el formato en que se guardan las fechas planificadas). */
export const toISODate = (date: Date) => format(date, "yyyy-MM-dd");

/** Fecha local a partir de YYYY-MM-DD. */
export const fromISODate = (value: string) => parseISO(value);

/** Siete días de la semana (domingo a sábado) que contiene `date`. */
export function weekOf(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

/** Inicial del día de la semana ("D", "L", "M"…). */
export const weekdayLetter = (date: Date) => format(date, "EEEEE", { locale: es }).toUpperCase();

/** "Domingo 15 nov" con inicial en mayúscula. */
export function longDate(date: Date) {
  const text = format(date, "EEEE d MMM", { locale: es }).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "Vie", "Lun 9"… para una fecha límite. */
export function shortDay(value: string) {
  const text = format(fromISODate(value), "EEE", { locale: es }).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Cuánto lleva vencida una fecha: "Venció ayer", "Venció hace 3 días". */
export function overdueLabel(value: string, today: Date = new Date()) {
  const days = differenceInCalendarDays(today, fromISODate(value));
  return days <= 1 ? "Venció ayer" : `Venció hace ${days} días`;
}
