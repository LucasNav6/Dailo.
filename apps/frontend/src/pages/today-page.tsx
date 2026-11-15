import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { addDays, format, isSameDay, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { RiAddLine, RiArrowLeftLine } from "@remixicon/react";
import { Emphasis } from "@/components/atoms/emphasis";
import { PillButton } from "@/components/atoms/pill-button";
import { PageColumn } from "@/components/layouts/page-column";
import { BottomSheet } from "@/components/molecules/bottom-sheet";
import { InlineAction } from "@/components/molecules/inline-action";
import { SkeletonSection } from "@/components/molecules/skeleton-section";
import { WeekStrip, type WeekDay } from "@/components/molecules/week-strip";
import { MonthCalendar } from "@/components/organisms/month-calendar";
import { OverdueCard } from "@/components/organisms/overdue-card";
import { TaskSection, type TaskItem } from "@/components/organisms/task-section";
import { EssentialIcon } from "@/features/today/components/essential-icon";
import { TodayHeader } from "@/features/today/components/today-header";
import { TodayEmptyState } from "@/features/today/views/empty.view";
import { useInbox } from "@/hooks/use-inbox";
import { usePreferences } from "@/hooks/use-settings";
import { useTasks } from "@/hooks/use-tasks";
import { longDate, overdueLabel, shortDay, toISODate, weekdayLetter, weekOf } from "@/lib/dates";
import type { Task, TimeOfDay } from "@/models/task.model";

const PERIODS: { key: TimeOfDay; title: string }[] = [
  { key: "morning", title: "Mañana" },
  { key: "midday", title: "Mediodía" },
  { key: "afternoon", title: "Tarde" },
  { key: "evening", title: "Noche" },
];

const hours = (value: string) => (value.endsWith(":00") ? value.slice(0, 2) : value);
const loadOf = (count: number): 0 | 1 | 2 | 3 => (count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3);

/** Hoy real: esenciales, franjas del día y semana, con las tareas planificadas en IndexedDB. */
export function TodayPage() {
  const navigate = useNavigate();
  const { tasks, isLoading, updateTask } = useTasks();
  const { tasks: inbox } = useInbox();
  const { preferences } = usePreferences();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState(today);
  const [monthOpen, setMonthOpen] = useState(false);
  const isToday = isSameDay(selected, today);
  const selectedISO = toISODate(selected);

  const week = weekOf(selected);
  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const task of tasks) {
      if (task.plannedDate && (task.status === "active" || task.status === "completed")) {
        map.set(task.plannedDate, (map.get(task.plannedDate) ?? 0) + 1);
      }
    }
    return map;
  }, [tasks]);

  const days: WeekDay[] = week.map((day) => ({
    letter: weekdayLetter(day),
    number: day.getDate(),
    label: longDate(day).replace(/ [a-zñ]{3}$/i, ""),
    selected: isSameDay(day, selected),
    load: isLoading ? 0 : loadOf(countByDay.get(toISODate(day)) ?? 0),
  }));

  const eyebrow = longDate(selected);
  const title = isToday ? <>Tu <Emphasis>hoy.</Emphasis></> : isSameDay(selected, addDays(today, 1)) ? <>Tu <Emphasis>mañana.</Emphasis></> : <>Tu <Emphasis>día.</Emphasis></>;

  if (isLoading || !preferences) {
    return (
      <PageColumn>
        <div aria-busy="true" className="contents">
          <TodayHeader eyebrow={eyebrow} title={title} />
          <WeekStrip days={days} />
          <SkeletonSection widths={[70, 55, 62]} />
          <SkeletonSection widths={[48, 66]} />
          <SkeletonSection widths={[58]} />
        </div>
      </PageColumn>
    );
  }

  const planned = tasks.filter(
    (task) => task.plannedDate === selectedISO && (task.status === "active" || task.status === "completed") && !task.parentId
  );
  const overdue = isToday
    ? tasks.filter((task) => task.status === "active" && !task.parentId && task.plannedDate && task.plannedDate < selectedISO)
    : [];

  const item = (task: Task): TaskItem => ({
    id: task.id,
    title: task.title,
    done: task.status === "completed",
    onToggle: (done) => void updateTask(task.id, { status: done ? "completed" : "active" }),
    time: task.essential && task.deadline ? shortDay(task.deadline) : undefined,
    timeIcon: task.essential && task.deadline ? <EssentialIcon /> : undefined,
  });

  const essentials = planned.filter((task) => task.essential);
  const rest = planned.filter((task) => !task.essential);
  const [b1, b2, b3] = preferences.periodBreaks;
  const bounds: [string, string][] = [
    [preferences.workday.start, b1],
    [b1, b2],
    [b2, b3],
    [b3, preferences.workday.end],
  ];
  const nowTime = format(today, "HH:mm");

  const sections = [
    ...PERIODS.map(({ key, title: label }, index) => {
      const [start, end] = bounds[index];
      const current = isToday && nowTime >= start && nowTime < end;
      const group = rest.filter((task) => task.timeOfDay === key);
      return { key, title: current ? `${label} · ahora` : label, range: `${hours(start)}–${hours(end)}`, group };
    }),
    { key: "none", title: "Sin franja", range: "", group: rest.filter((task) => !task.timeOfDay) },
  ].filter((section) => section.group.length > 0);

  const renderSection = ({ key, title: label, range, group }: (typeof sections)[number]) => {
    const done = group.filter((task) => task.status === "completed");
    // Franja resuelta por completo: solo el resumen, como en el diseño.
    if (done.length === group.length) return <TaskSection key={key} title={label} meta={`${done.length} ${done.length === 1 ? "hecha" : "hechas"}`} />;
    return <TaskSection key={key} title={label} meta={range || undefined} tasks={group.map(item)} />;
  };

  const goTo = (date: Date) => {
    setSelected(date);
    setMonthOpen(false);
  };

  const monthLoads: Record<number, 1 | 2 | 3> = {};
  for (const [iso, count] of countByDay) {
    const date = new Date(`${iso}T00:00:00`);
    if (isSameMonth(date, selected)) monthLoads[date.getDate()] = loadOf(count) || 1;
  }

  return (
    <PageColumn>
      <TodayHeader eyebrow={eyebrow} title={title} onMonth={() => setMonthOpen(true)} />
      <WeekStrip days={days} onSelect={(index) => setSelected(week[index])} />
      {!isToday && (
        <PillButton className="mb-1" onClick={() => setSelected(today)}>
          <RiArrowLeftLine aria-hidden />
          Volver a hoy
        </PillButton>
      )}

      {overdue.length > 0 && (
        <OverdueCard
          tasks={overdue.map((task) => ({ title: task.title, due: overdueLabel(task.plannedDate!, today) }))}
          actions={["Traer todas a hoy"]}
          onAction={() => overdue.forEach((task) => void updateTask(task.id, { plannedDate: toISODate(today), timeOfDay: undefined }))}
        />
      )}

      {planned.length === 0 && overdue.length === 0 ? (
        isToday ? (
          <TodayEmptyState inboxCount={inbox.length} onInbox={() => navigate("/inbox")} onPlan={() => navigate("/inbox")} />
        ) : (
          <InlineAction icon={<RiAddLine aria-hidden />} onClick={() => navigate("/inbox")}>Planificar algo</InlineAction>
        )
      ) : (
        <>
          {essentials.length > 0 && (
            <TaskSection
              title="Esenciales"
              meta={`${essentials.filter((task) => task.status === "completed").length} de ${preferences.maxEssentialTasks}`}
              tasks={essentials.map(item)}
            />
          )}
          {sections.map(renderSection)}
          {!isToday && <InlineAction icon={<RiAddLine aria-hidden />} onClick={() => navigate("/inbox")}>Planificar algo</InlineAction>}
        </>
      )}

      <BottomSheet open={monthOpen} onOpenChange={setMonthOpen} label="Vistazo al mes" className="gap-2 pb-7">
        <div className="flex items-center justify-between pb-1">
          <span className="font-display text-[22px] font-semibold text-foreground">
            {format(selected, "MMMM", { locale: es }).replace(/^./, (c) => c.toUpperCase())} <Emphasis>{format(selected, "yyyy")}</Emphasis>
          </span>
          <button type="button" className="text-sm font-semibold text-foreground" onClick={() => goTo(today)}>Ir a hoy</button>
        </div>
        <MonthCalendar month={selected} today={today} selected={selected} loads={monthLoads} onSelect={goTo} />
      </BottomSheet>
    </PageColumn>
  );
}
