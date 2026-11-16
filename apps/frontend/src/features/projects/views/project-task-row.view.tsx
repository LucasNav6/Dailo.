import { Fragment } from "react"
import { DragHandle } from "@/shared/components/atoms/drag-handle"
import { SubtaskRow } from "@/shared/components/molecules/subtask-row"
import { SubtaskToggle } from "@/shared/components/molecules/subtask-toggle"
import { TaskRow } from "@/shared/components/molecules/task-row"
import { TaskDatesView } from "@/features/tasks"
import { cn } from "@/shared/libs/utils"
import type { Task } from "@/shared/models/task.model"
import type { ProjectDetailPageState } from "../hooks/project-detail-page.hook"
import { DATED_ROW, DRAGGED_ROW, PROJECT_ROW } from "../libs/drag-styles"

type ProjectTaskRowViewProps = { page: ProjectDetailPageState; task: Task; group: string }

export function ProjectTaskRowView({ page, task, group }: ProjectTaskRowViewProps) {
  const { subs, dragged, dimmed, dates } = page.rowState(task)
  const open = page.isExpanded(task.id)
  const dated = Boolean(dates.planned || dates.deadline)
  const { taskDrag } = page

  return (
    <Fragment>
      <TaskRow
        ref={taskDrag.rowRef(task.id, group)}
        style={dragged ? { transform: `translateY(${taskDrag.drag?.offset ?? 0}px)` } : undefined}
        onOpen={() => page.openTask(task.id)}
        id={`task-${task.id}`}
        title={task.title}
        checked={task.status === "completed"}
        onCheckedChange={(done) => page.toggleDone(task, done)}
        subtitle={dated ? <TaskDatesView {...dates} /> : undefined}
        className={cn(dated ? DATED_ROW : PROJECT_ROW, dragged && DRAGGED_ROW, dimmed && "opacity-55")}
        meta={
          subs.length > 0 ? (
            <button
              type="button"
              aria-expanded={open}
              aria-label={`Subtareas de ${task.title}`}
              onClick={() => page.toggleExpanded(task.id)}
              className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <SubtaskToggle count={`${subs.filter((sub) => sub.status === "completed").length}/${subs.length}`} open={open} />
            </button>
          ) : undefined
        }
        handle={
          <DragHandle
            aria-label={`Reordenar ${task.title}`}
            active={dragged}
            onPointerDown={(event) => taskDrag.start(task.id, group, event)}
            onKeyDown={(event) => page.nudgeTask(task, group, event)}
          />
        }
      />
      {open &&
        subs.map((sub) => (
          <SubtaskRow
            key={sub.id}
            title={sub.title}
            checked={sub.status === "completed"}
            onCheckedChange={(done) => page.toggleSubtask(sub.id, done)}
            onRemove={() => page.setSubtaskToDelete(sub)}
          />
        ))}
    </Fragment>
  )
}
