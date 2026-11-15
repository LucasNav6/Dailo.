import { PERIODS, getPeriods, defaultPreferences } from "@/services/setting.service";
import { usePreferences } from "@/hooks/use-settings";
import { PERIOD_ICON, PERIOD_TIME } from "@/lib/periods";
import type { Task, TimeOfDay } from "@/models/task.model";
import { ChoiceRow } from "@/components/choice-row";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

type Props = { task: Task | null; onClose: () => void; onSelect: (task: Task, timeOfDay: TimeOfDay) => void };

/** "¿Antes de qué checkpoint?": elegir la franja de una tarea de hoy. */
export function PeriodSheet({ task, onClose, onSelect }: Props) {
  const { preferences } = usePreferences();
  const ranges = getPeriods(preferences ?? defaultPreferences);

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[92svh] gap-0 overflow-y-auto p-0">
        <SheetDescription className="sr-only">Elegí la franja del día para esta tarea.</SheetDescription>
        <div className="flex flex-col gap-4 px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <span aria-hidden className="h-1 w-10 self-center rounded-full bg-border" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold tracking-[0.06em] text-[var(--forest-700)] uppercase dark:text-muted-foreground">Tarea de hoy</span>
            <p className="text-base">{task?.title}</p>
          </div>
          <SheetTitle className="font-serif text-2xl leading-tight font-semibold tracking-tight">
            ¿Antes de qué <em className="font-medium">checkpoint?</em>
          </SheetTitle>
          <div className="flex flex-col gap-2.5">
            {PERIODS.map(({ id, label }) => (
              <ChoiceRow
                key={id}
                Icon={PERIOD_ICON[id]}
                title={label}
                hint={`${ranges[id].start} – ${ranges[id].end}`}
                selected={task?.timeOfDay === PERIOD_TIME[id]}
                onClick={() => task && onSelect(task, PERIOD_TIME[id])}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
