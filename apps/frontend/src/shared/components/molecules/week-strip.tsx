import { cn } from "@/shared/libs/utils"

export type WeekDay = {
  letter: string;
  number: number;
  selected?: boolean;
  load?: 0 | 1 | 2 | 3;
  label: string;
};

const LOAD_WIDTH = { 0: "w-1", 1: "w-1.5", 2: "w-2", 3: "w-2.5" } as const;

const circle = (day: WeekDay) =>
  cn("grid size-9 place-items-center rounded-full text-base", day.selected ? "bg-primary font-semibold text-primary-foreground" : "font-medium text-foreground")

function WeekStrip({ days, onSelect }: { days: WeekDay[]; onSelect?: (index: number) => void }) {
  return (
    <ol className="mt-1 mb-2 grid grid-cols-7 pt-1 pb-3">
      {days.map((day, index) => (
        <li key={day.label} className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">{day.letter}</span>
          {onSelect ? (
            <button type="button" aria-current={day.selected ? "date" : undefined} aria-label={day.label} onClick={() => onSelect(index)} className={cn(circle(day), "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}>
              {day.number}
            </button>
          ) : (
            <span aria-current={day.selected ? "date" : undefined} aria-label={day.label} className={circle(day)}>
              {day.number}
            </span>
          )}
          <span className={cn("h-1 rounded-full", LOAD_WIDTH[day.load ?? 0], (day.load ?? 0) > 0 ? "bg-subtle" : "bg-transparent")} />
        </li>
      ))}
    </ol>
  )
}

export { WeekStrip }
