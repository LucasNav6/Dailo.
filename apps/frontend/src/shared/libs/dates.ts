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

const lower = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

export function plannedLabel(value: string, today: Date = new Date()) {
  const diff = differenceInCalendarDays(fromISODate(value), today);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  if (Math.abs(diff) <= 6) return format(fromISODate(value), "EEE d", { locale: es }).replace(/^./, (c) => c.toUpperCase()).replace(".", "");
  return format(fromISODate(value), "d MMM", { locale: es }).replace(".", "");
}

export function deadlineInfo(value: string, today: Date = new Date()) {
  const diff = differenceInCalendarDays(fromISODate(value), today);
  const date = fromISODate(value);
  const weekday = format(date, "EEE d", { locale: es }).replace(".", "");
  const urgent = diff <= 2;
  if (diff < 0) return { label: `Venció el ${weekday}`, urgent };
  if (diff <= 6) return { label: `Límite ${weekday}`, urgent };
  return { label: `Límite ${lower(format(date, "d MMM", { locale: es }).replace(".", ""))}`, urgent };
}
