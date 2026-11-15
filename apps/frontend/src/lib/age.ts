import { differenceInCalendarDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Antigüedad legible como en el diseño: "Hace 5 min", "Hace 2 horas", "Ayer", "Hace 2 días", "Hace 3 semanas". */
export function formatAge(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const days = differenceInCalendarDays(now, date);
  if (days === 0) return `Hace ${plural(differenceInHours(now, date), "hora", "horas")}`;
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${plural(Math.floor(days / 7), "semana", "semanas")}`;
  return format(date, "d MMM yyyy", { locale: es });
}
