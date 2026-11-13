import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RiFocus2Line } from "@remixicon/react";
import { useToday } from "@/hooks/use-today";
import { usePreferences } from "@/hooks/use-settings";
import { PERIOD_ICON, PERIOD_TIME } from "@/lib/periods";
import { cn } from "@/lib/utils";
import type { Task } from "@/models/task.model";
import { defaultPreferences, getPeriods, PERIODS, toMinutes } from "@/services/setting.service";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/page-header";
import { PeriodSheet } from "@/components/period-sheet";
import { ErrorView } from "@/components/wrappers/error-view";
import { EmptyState } from "@/components/wrappers/empty-state";
import { LoadingView } from "@/components/wrappers/loading-view";

const minutesNow = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};
const label = (value: string) => value.replace(/^0/, "");

export function TodayPage() {
  const { date, tasks, isLoading, setCompleted, setTimeOfDay } = useToday();
  const { preferences } = usePreferences();
  const [picking, setPicking] = useState<Task | null>(null);
  const [failed, setFailed] = useState(false);
  const ranges = getPeriods(preferences ?? defaultPreferences);
  const now = minutesNow();

  if (isLoading) return <LoadingView label="Cargando Hoy…" />;

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  const unscheduled = tasks.filter((task) => !task.timeOfDay);
  const sections = PERIODS.map(({ id, label: name }) => {
    const items = tasks.filter((task) => task.timeOfDay === PERIOD_TIME[id]);
    const range = ranges[id];
    return {
      id,
      name,
      range,
      items,
      done: items.filter((task) => task.status === "completed").length,
      current: now >= toMinutes(range.start) && now < toMinutes(range.end),
      past: now >= toMinutes(range.end),
    };
  });

  const row = (task: Task, past: boolean) => {
    const done = task.status === "completed";
    return (
      <li key={task.id} className="flex items-center gap-3.5 py-1 pl-1">
        <Checkbox checked={done} onCheckedChange={() => void run(() => setCompleted(task.id, !done))} aria-label={`${done ? "Reactivar" : "Completar"}: ${task.title}`} />
        <button
          type="button"
          onClick={() => setPicking(task)}
          className={cn("flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg text-left text-[17px] leading-snug outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", done && "text-muted-foreground line-through decoration-wavy decoration-1")}
        >
          <span className="min-w-0 flex-1">{task.title}</span>
          {!done && past && <Badge className="border-transparent bg-accent text-destructive">Pendiente</Badge>}
          {task.deadline === date && !done && (
            <span role="img" aria-label="Deadline hoy" className="flex text-muted-foreground">
              <RiFocus2Line className="size-5" aria-hidden />
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <>
      <PageHeader eyebrow={`Hoy · ${format(new Date(), "EEEE d", { locale: es })}`} title="Tu día," em="claro." />

      <div className="mb-6 flex gap-1.5" aria-hidden>
        {sections.map(({ id, items, done }) => (
          <span key={id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full rounded-full bg-primary" style={{ width: items.length ? `${(done / items.length) * 100}%` : 0 }} />
          </span>
        ))}
      </div>

      <ErrorView message={failed ? "No se pudo guardar el cambio. Probá de nuevo." : null} className="mb-3" />

      {tasks.length === 0 && <EmptyState title="Nada para" em="hoy." description="Lo que planifiques o venza hoy aparece acá, por checkpoint." />}

      <div className="flex flex-col gap-5">
        {unscheduled.length > 0 && (
          <section aria-label="Sin franja" className="flex flex-col gap-1.5">
            <h2 className="text-[15px] font-semibold">
              Sin franja <span className="text-xs font-normal text-muted-foreground">· tocá una para elegir checkpoint</span>
            </h2>
            <ul>{unscheduled.map((task) => row(task, false))}</ul>
          </section>
        )}

        {sections.map(({ id, name, range, items, done, current, past }) => {
          const Icon = PERIOD_ICON[id];
          return (
            <section key={id} aria-labelledby={`period-${id}`} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <span aria-hidden className={cn("grid size-8 place-items-center rounded-full bg-secondary", current && "bg-primary text-primary-foreground")}>
                  <Icon className="size-[18px]" />
                </span>
                <h2 id={`period-${id}`} className={cn("text-[15px]", current ? "font-bold underline" : "font-semibold")} aria-current={current ? "time" : undefined}>
                  {name} <span className="text-xs font-normal text-muted-foreground">- {label(range.start)} – {label(range.end)}</span>
                </h2>
                {items.length > 0 && <span className="ml-auto text-[13px] font-semibold">{done}/{items.length}</span>}
              </div>
              {items.length > 0 && <ul>{items.map((task) => row(task, past))}</ul>}
            </section>
          );
        })}
      </div>

      <PeriodSheet
        task={picking}
        onClose={() => setPicking(null)}
        onSelect={(task, timeOfDay) => {
          setPicking(null);
          void run(() => setTimeOfDay(task.id, timeOfDay, date));
        }}
      />
    </>
  );
}
