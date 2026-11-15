import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export const toISODate = (date: Date) => format(date, "yyyy-MM-dd");

export const fromISODate = (value: string) => parseISO(value);

export function weekOf(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export const weekdayLetter = (date: Date) => format(date, "EEEEE", { locale: es }).toUpperCase();

export function longDate(date: Date) {
  const text = format(date, "EEEE d MMM", { locale: es }).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function shortDay(value: string) {
  const text = format(fromISODate(value), "EEE", { locale: es }).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function overdueLabel(value: string, today: Date = new Date()) {
  const days = differenceInCalendarDays(today, fromISODate(value));
  return days <= 1 ? "Venció ayer" : `Venció hace ${days} días`;
}

export function dayLabel(value: string, today: Date = new Date()) {
  const diff = differenceInCalendarDays(fromISODate(value), today);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  return dateLabel(value);
}

export function dateLabel(value: string) {
  const text = format(fromISODate(value), "EEE d MMM", { locale: es }).replace(/\./g, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
