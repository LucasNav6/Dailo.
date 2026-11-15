import { cn } from "@/lib/utils"

export type WeekDay = {
  letter: string;
  number: number;
  /** Día seleccionado (círculo oscuro). */
  selected?: boolean;
  /** Carga de tareas 0–3; 0 no muestra marca. */
  load?: 0 | 1 | 2 | 3;
  label: string;
};

const LOAD_WIDTH = { 0: "w-1", 1: "w-1.5", 2: "w-2", 3: "w-2.5" } as const;

/** Franja de siete días con marca de carga bajo cada número. */
function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <ol className="mt-1 mb-2 grid grid-cols-7 pt-1 pb-3">
      {days.map((day) => (
        <li key={day.label} className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">{day.letter}</span>
          <span
            aria-current={day.selected ? "date" : undefined}
            aria-label={day.label}
            className={cn(
              "grid size-9 place-items-center rounded-full text-base",
              day.selected ? "bg-primary font-semibold text-primary-foreground" : "font-medium text-foreground"
            )}
          >
            {day.number}
          </span>
          <span className={cn("h-1 rounded-full", LOAD_WIDTH[day.load ?? 0], (day.load ?? 0) > 0 ? "bg-subtle" : "bg-transparent")} />
        </li>
      ))}
    </ol>
  )
}

export { WeekStrip }
