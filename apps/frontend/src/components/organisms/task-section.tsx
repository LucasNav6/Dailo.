import type { ReactNode } from "react"
import { SectionHeader } from "@/components/molecules/section-header"
import { TaskRow } from "@/components/molecules/task-row"

export type TaskItem = {
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
            <TaskRow key={task.title} title={task.title} checked={task.done} time={task.time} timeIcon={task.timeIcon} />
          ))}
        </ul>
      )}
    </>
  )
}

export { TaskSection }
