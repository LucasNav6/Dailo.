import { Fragment, type ReactNode } from "react"
import { SectionHeader } from "@/components/molecules/section-header"
import { SubtaskRow } from "@/components/molecules/subtask-row"
import { TaskRow } from "@/components/molecules/task-row"

export type SubtaskItem = { id: string; title: string; done: boolean; onToggle?: (done: boolean) => void };

export type TaskItem = {
  /** Contenido a la derecha (p. ej. contador de subtareas); sustituye a time/timeIcon. */
  meta?: ReactNode;
  /** Subtareas visibles bajo la fila (cuando está desplegada). */
  subtasks?: SubtaskItem[];
  id?: string;
  onToggle?: (done: boolean) => void;
  title: string;
  done?: boolean;
  time?: ReactNode;
  timeIcon?: ReactNode;
};

/** Grupo de tareas con encabezado (franja del día, esenciales…) y su lista. Sin tareas, solo el encabezado. */
function TaskSection({ title, meta, tasks = [] }: { title: ReactNode; meta?: ReactNode; tasks?: TaskItem[] }) {
  return (
    <>
      <SectionHeader title={title} meta={meta} />
      {tasks.length > 0 && (
        <ul className="m-0 flex flex-col p-0">
          {tasks.map((task) => (
            <Fragment key={task.id ?? task.title}>
              <TaskRow id={task.id ? `task-${task.id}` : undefined} title={task.title} checked={task.done} onCheckedChange={task.onToggle} time={task.time} timeIcon={task.timeIcon} meta={task.meta} />
              {task.subtasks?.map((sub) => (
                <SubtaskRow key={sub.id} title={sub.title} checked={sub.done} onCheckedChange={sub.onToggle} />
              ))}
            </Fragment>
          ))}
        </ul>
      )}
    </>
  )
}

export { TaskSection }
