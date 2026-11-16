import { RiFlagLine } from "@remixicon/react"
import { SubtaskToggle } from "@/shared/components/molecules/subtask-toggle"
import type { TaskItem } from "@/shared/components/organisms/task-section"
import type { AgendaItem } from "../hooks/agenda-page.hook"
import { EssentialIconView } from "./essential-icon.view"

export function toTaskItem(item: AgendaItem): TaskItem {
  const timeIcon =
    item.timeKind === "deadline" ? <RiFlagLine aria-hidden /> : item.timeKind === "essential" ? <EssentialIconView /> : undefined
  return {
    id: item.id,
    title: item.title,
    done: item.done,
    onToggle: item.onToggle,
    time: item.time,
    timeIcon,
    meta: item.subtaskCount ? (
      <span className="inline-flex items-center gap-2">
        {(item.time || timeIcon) && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground [&>svg]:size-4">
            {timeIcon}
            {item.time}
          </span>
        )}
        <button
          type="button"
          aria-expanded={item.open}
          aria-label={`Subtareas de ${item.title}`}
          onClick={item.onToggleSubtasks}
          className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <SubtaskToggle count={item.subtaskCount} open={item.open} />
        </button>
      </span>
    ) : undefined,
    subtasks: item.open ? item.subs.map((sub) => ({ id: sub.id, title: sub.title, done: sub.done, onToggle: (done: boolean) => item.onToggleSub(sub.id, done) })) : undefined,
  }
}
