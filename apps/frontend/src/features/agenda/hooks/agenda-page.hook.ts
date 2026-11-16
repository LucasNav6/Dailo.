import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { addDays, format, isSameDay, isSameMonth, parseISO } from "date-fns"
import { useInbox } from "@/features/inbox"
import { usePreferences } from "@/features/settings"
import { byPosition, isVisible, useSetTaskDone, useTasks } from "@/features/tasks"
import { useRecentlyCompleted } from "@/shared/hooks/use-recently-completed.hook"
import { useToast } from "@/shared/hooks/toast.hook"
import { longDate, overdueLabel, shortDay, toISODate, weekdayLetter, weekOf } from "@/shared/libs/dates"
import type { Task, TimeOfDay } from "@/shared/models/task.model"
import { phraseFor } from "../libs/done-phrases"
import { effectiveDate, isDeadlineOnly } from "../libs/effective-date"
import { hours, loadOf, PERIODS } from "../libs/agenda-layout"
import { useBringOverdueToToday } from "./bring-overdue-to-today.hook"

export type AgendaItem = {
  id: string
  title: string
  done: boolean
  time?: string
  timeKind?: "deadline" | "essential"
  subtaskCount?: string
  open: boolean
  subs: { id: string; title: string; done: boolean }[]
  onToggle: (done: boolean) => void
  onToggleSubtasks: () => void
  onToggleSub: (id: string, done: boolean) => void
}

export function useAgendaPage() {
  const navigate = useNavigate()
  const { tasks, isLoading, hasError, reload } = useTasks()
  const setTaskDone = useSetTaskDone()
  const bringOverdueToToday = useBringOverdueToToday()
  const { tasks: inbox } = useInbox()
  const { preferences } = usePreferences()
  const { show } = useToast()
  const today = useMemo(() => new Date(), [])
  const [selected, setSelected] = useState(today)
  const [monthOpen, setMonthOpen] = useState(false)
  const { isRecent, markCompleted } = useRecentlyCompleted()
  const [expanded, setExpanded] = useState<string[]>([])
  const [showCompleted, setShowCompleted] = useState(false)
  const [undoId, setUndoId] = useState<string | null>(null)

  useEffect(() => {
    if (!undoId) return
    show(
      {
        message: "Tarea completada",
        actionLabel: "Deshacer",
        onAction: () => {
          void setTaskDone(undoId, false)
          setUndoId(null)
        },
      },
      6000
    )
    const timer = setTimeout(() => setUndoId(null), 6000)
    return () => clearTimeout(timer)
  }, [undoId, show, setTaskDone])

  const isToday = isSameDay(selected, today)
  const selectedISO = toISODate(selected)
  const week = weekOf(selected)

  const countByDay = useMemo(() => {
    const map = new Map<string, number>()
    for (const task of tasks) {
      const date = effectiveDate(task)
      if (date && !task.parentId && isVisible(task.status)) map.set(date, (map.get(date) ?? 0) + 1)
    }
    return map
  }, [tasks])

  const days = week.map((day) => ({
    letter: weekdayLetter(day),
    number: day.getDate(),
    label: longDate(day).replace(/ [a-zñ]{3}$/i, ""),
    selected: isSameDay(day, selected),
    load: isLoading ? 0 : loadOf(countByDay.get(toISODate(day)) ?? 0),
  }))

  const planned = tasks.filter((task) => effectiveDate(task) === selectedISO && isVisible(task.status) && !task.parentId)
  const overdueTasks = isToday
    ? tasks.filter((task) => task.status === "active" && !task.parentId && (effectiveDate(task) ?? selectedISO) < selectedISO)
    : []

  const toItem = (task: Task): AgendaItem => {
    const subs = tasks.filter((sub) => sub.parentId === task.id && isVisible(sub.status)).sort(byPosition)
    const deadlineOnly = isDeadlineOnly(task)
    const timeKind = deadlineOnly ? "deadline" : task.essential && task.deadline ? "essential" : undefined
    return {
      id: task.id,
      title: task.title,
      done: task.status === "completed",
      time: deadlineOnly ? "Límite" : task.essential && task.deadline ? shortDay(task.deadline) : undefined,
      timeKind,
      subtaskCount: subs.length > 0 ? `${subs.filter((sub) => sub.status === "completed").length}/${subs.length}` : undefined,
      open: expanded.includes(task.id),
      subs: subs.map((sub) => ({ id: sub.id, title: sub.title, done: sub.status === "completed" })),
      onToggle: (done) => {
        if (done) {
          markCompleted(task.id)
          setUndoId(task.id)
        }
        void setTaskDone(task.id, done)
      },
      onToggleSubtasks: () => setExpanded((current) => (current.includes(task.id) ? current.filter((value) => value !== task.id) : [...current, task.id])),
      onToggleSub: (id, done) => void setTaskDone(id, done),
    }
  }

  const pendingTasks = planned.filter((task) => task.status === "active" || isRecent(task.id))
  const completedTasks = planned
    .filter((task) => task.status === "completed" && !isRecent(task.id))
    .sort((x, y) => (y.completedAt ?? "").localeCompare(x.completedAt ?? ""))
  const essentials = planned.filter((task) => task.essential)
  const pendingEssentials = pendingTasks.filter((task) => task.essential)
  const rest = pendingTasks.filter((task) => !task.essential)

  const sections = (() => {
    if (!preferences) return []
    const [b1, b2, b3] = preferences.periodBreaks
    const bounds: [string, string][] = [
      [preferences.workday.start, b1],
      [b1, b2],
      [b2, b3],
      [b3, preferences.workday.end],
    ]
    const nowTime = format(today, "HH:mm")
    return [
      ...PERIODS.map(({ key, title }, index) => {
        const [start, end] = bounds[index]
        return {
          key: key as string,
          period: key as TimeOfDay | undefined,
          title,
          badge: isToday && nowTime >= start && nowTime < end ? "Ahora" : undefined,
          range: `${hours(start)}–${hours(end)}`,
          items: rest.filter((task) => task.timeOfDay === key).map(toItem),
        }
      }),
      {
        key: "none",
        period: undefined,
        title: "Sin franja",
        badge: undefined,
        range: "",
        items: rest.filter((task) => !task.timeOfDay).map(toItem),
      },
    ].filter((section) => section.items.length > 0)
  })()

  const monthLoads: Record<number, 1 | 2 | 3> = {}
  for (const [iso, count] of countByDay) {
    const date = new Date(`${iso}T00:00:00`)
    if (isSameMonth(date, selected)) monthLoads[date.getDate()] = loadOf(count) || 1
  }

  const goTo = (date: Date) => {
    setSelected(date)
    setMonthOpen(false)
  }

  const phrase = phraseFor(selectedISO)
  const tomorrow = isSameDay(selected, addDays(today, 1))

  return {
    isLoading: isLoading || !preferences,
    hasError,
    reload,
    today,
    selected,
    isToday,
    eyebrow: longDate(selected),
    titleKind: (isToday ? "today" : tomorrow ? "tomorrow" : "day") as "today" | "tomorrow" | "day",
    days,
    monthOpen,
    monthLoads,
    openMonth: () => setMonthOpen(true),
    setMonthOpen,
    goTo,
    selectDay: (index: number) => setSelected(week[index]),
    goToToday: () => setSelected(today),
    goToTomorrow: () => setSelected(addDays(today, 1)),
    overdue: overdueTasks.map((task) => ({ title: task.title, due: overdueLabel(effectiveDate(task)!, today) })),
    bringOverdue: () => void bringOverdueToToday(overdueTasks, today),
    isEmpty: planned.length === 0 && overdueTasks.length === 0,
    inboxCount: inbox.length,
    goInbox: () => navigate("/inbox"),
    achieved: isToday && planned.length > 0 && pendingTasks.length === 0 && overdueTasks.length === 0,
    plannedCount: planned.length,
    essentialsTotal: essentials.length,
    essentialsDone: essentials.filter((task) => task.status === "completed").length,
    maxEssential: preferences?.maxEssentialTasks ?? 0,
    pendingEssentials: pendingEssentials.map(toItem),
    phrase,
    sections,
    completed: completedTasks.map((task) => ({
      id: task.id,
      title: task.title,
      done: true,
      time: task.completedAt ? format(parseISO(task.completedAt), "HH:mm") : undefined,
      onToggle: () => void setTaskDone(task.id, false),
    })),
    showCompleted,
    toggleCompleted: () => setShowCompleted((value) => !value),
  }
}

export type AgendaPageState = ReturnType<typeof useAgendaPage>
