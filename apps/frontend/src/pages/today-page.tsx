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
import { SkeletonEssentials, SkeletonSection } from "@/components/molecules/skeleton-section";
import { WeekStrip, type WeekDay } from "@/components/molecules/week-strip";
import { SubtaskToggle } from "@/components/molecules/subtask-toggle";
import { MonthCalendar } from "@/components/organisms/month-calendar";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { OverdueCard } from "@/components/organisms/overdue-card";
import { TaskSection, type TaskItem } from "@/components/organisms/task-section";
import { EssentialIcon } from "@/features/today/components/essential-icon";
import { useBringOverdueToToday } from "@/features/today/hooks/bring-overdue-to-today.hook";
import { useSetTaskDone } from "@/features/today/hooks/set-task-done.hook";
import { TodayHeader } from "@/features/today/components/today-header";
import { TodayEmptyState } from "@/features/today/views/empty.view";
import { useInbox } from "@/features/inbox/hooks/list-inbox.hook";
import { usePreferences } from "@/features/settings/hooks/get-preferences.hook";
import { useTasks } from "@/features/projects/hooks/list-tasks.hook";
import { useRecentlyCompleted } from "@/lib/use-recently-completed";
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

export function TodayPage() {
  const navigate = useNavigate();
  const { tasks, isLoading } = useTasks();
  const setTaskDone = useSetTaskDone();
  const bringOverdueToToday = useBringOverdueToToday();
  const { tasks: inbox } = useInbox();
  const { preferences } = usePreferences();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState(today);
  const [monthOpen, setMonthOpen] = useState(false);
  const { isRecent, markCompleted } = useRecentlyCompleted();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [openPast, setOpenPast] = useState<string[]>([]);
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
          <SkeletonEssentials widths={[70, 55, 62]} />
          <SkeletonSection widths={[48, 66]} />
          <SkeletonSection widths={[58]} label={60} />
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

  const item = (task: Task): TaskItem => {
    const subs = tasks.filter((sub) => sub.parentId === task.id && (sub.status === "active" || sub.status === "completed")).sort((x, y) => x.position - y.position);
    const open = expanded.includes(task.id);
    const time = task.essential && task.deadline ? shortDay(task.deadline) : undefined;
    const timeIcon = task.essential && task.deadline ? <EssentialIcon /> : undefined;
    return {
      id: task.id,
      title: task.title,
      done: task.status === "completed",
      onToggle: (done) => {
        if (done) markCompleted(task.id);
        void setTaskDone(task.id, done);
      },
      time,
      timeIcon,
      meta:
        subs.length > 0 ? (
          <span className="inline-flex items-center gap-2">
            {(time || timeIcon) && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground [&>svg]:size-4">
                {timeIcon}
                {time}
              </span>
            )}
            <button
              type="button"
              aria-expanded={open}
              aria-label={`Subtareas de ${task.title}`}
              onClick={() => setExpanded((current) => (open ? current.filter((value) => value !== task.id) : [...current, task.id]))}
              className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <SubtaskToggle count={`${subs.filter((sub) => sub.status === "completed").length}/${subs.length}`} open={open} />
            </button>
          </span>
        ) : undefined,
      subtasks: open
        ? subs.map((sub) => ({ id: sub.id, title: sub.title, done: sub.status === "completed", onToggle: (done: boolean) => void setTaskDone(sub.id, done) }))
        : undefined,
    };
  };

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
      const ended = isToday && nowTime >= end;
      const group = rest.filter((task) => task.timeOfDay === key);
      return { key, period: key as TimeOfDay, title: label, badge: current ? "Ahora" : undefined, ended, range: `${hours(start)}–${hours(end)}`, group };
    }),
    { key: "none", period: undefined, title: "Sin franja", badge: undefined, ended: false, range: "", group: rest.filter((task) => !task.timeOfDay) },
  ].filter((section) => section.group.length > 0);

  const renderSection = ({ key, period, title: label, badge, ended, range, group }: (typeof sections)[number]) => {
    const done = group.filter((task) => task.status === "completed" && !isRecent(task.id));
    const foldable = ended && done.length === group.length;
    const isOpen = openPast.includes(key);
    return (
      <TaskSection
        key={key}
        title={label}
        period={period}
        badge={badge}
        meta={foldable ? `${done.length} ${done.length === 1 ? "hecha" : "hechas"}` : range || undefined}
        collapsed={foldable ? !isOpen : undefined}
        onToggle={foldable ? () => setOpenPast((current) => (isOpen ? current.filter((value) => value !== key) : [...current, key])) : undefined}
        tasks={group.map(item)}
      />
    );
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
          onAction={() => void bringOverdueToToday(overdue, today)}
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
            <EssentialsBox
              done={essentials.filter((task) => task.status === "completed").length}
              max={preferences.maxEssentialTasks}
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
