import { addDays, endOfMonth, endOfWeek, format, getDate, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const LOAD_WIDTH = { 1: "w-1.5", 2: "w-2", 3: "w-2.5" } as const;
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

type MonthCalendarProps = {
  /** Cualquier fecha dentro del mes a mostrar. */
  month: Date;
  today: Date;
  /** Carga de tareas (1–3) por día del mes visible. */
  loads?: Record<number, 1 | 2 | 3>;
  /** Día elegido (marcado con borde); distinto de `today`. */
  selected?: Date;
  /** Hace que cada día sea un botón. */
  onSelect?: (day: Date) => void;
};

/** Cuadrícula mensual lunes→domingo con días de otros meses atenuados y marca de carga por día. */
function MonthCalendar({ month, today, loads = {}, selected, onSelect }: MonthCalendarProps) {
  const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days: Date[] = []
  for (let day = first; day <= last; day = addDays(day, 1)) days.push(day)

  return (
    <>
      <div className="grid grid-cols-7 pt-2">
        {WEEKDAYS.map((letter, index) => (
          <span key={index} className="text-center text-xs font-medium text-muted-foreground">
            {letter}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5" role="grid">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month)
          const load = inMonth ? loads[getDate(day)] : undefined
          const isToday = isSameDay(day, today)
          const cell = (
            <>
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full text-[15px]",
                  isToday ? "bg-primary font-semibold text-primary-foreground" : cn("font-medium", inMonth ? "text-foreground" : "text-faint"),
                  selected && isSameDay(day, selected) && !isToday && "ring-2 ring-primary"
                )}
              >
                {getDate(day)}
              </span>
              <span className={cn("h-1 rounded-full", load ? cn(LOAD_WIDTH[load], "bg-subtle") : "w-1 bg-transparent")} />
            </>
          )
          return (
            <div key={format(day, "yyyy-MM-dd")} role="gridcell" className="flex h-12 flex-col items-center gap-0.5">
              {onSelect ? (
                <button
                  type="button"
                  aria-label={format(day, "d 'de' MMMM", { locale: es })}
                  onClick={() => onSelect(day)}
                  className="flex h-12 flex-col items-center gap-0.5 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {cell}
                </button>
              ) : (
                cell
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export { MonthCalendar }
