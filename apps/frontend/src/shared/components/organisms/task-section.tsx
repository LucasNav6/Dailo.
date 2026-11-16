import { Fragment, type ReactNode } from "react"
import { PeriodIcon, type Period } from "@/shared/components/atoms/period-icon"
import { SectionHeader } from "@/shared/components/molecules/section-header"
import { SubtaskRow } from "@/shared/components/molecules/subtask-row"
import { TaskRow } from "@/shared/components/molecules/task-row"

export type SubtaskItem = { id: string; title: string; done: boolean; onToggle?: (done: boolean) => void };

export type TaskItem = {
  meta?: ReactNode;
  subtasks?: SubtaskItem[];
  id?: string;
  onToggle?: (done: boolean) => void;
  title: string;
  done?: boolean;
  time?: ReactNode;
  timeIcon?: ReactNode;
};

function TaskList({ tasks }: { tasks: TaskItem[] }) {
  return (
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
  )
}

type TaskSectionProps = {
  title: ReactNode;
  meta?: ReactNode;
  tasks?: TaskItem[];
  period?: Period;
  badge?: ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

function TaskSection({ title, meta, tasks = [], period, badge, collapsed, onToggle }: TaskSectionProps) {
  const foldable = collapsed !== undefined
  return (
    <>
      <SectionHeader title={title} meta={meta} icon={period ? <PeriodIcon period={period} /> : undefined} badge={badge} open={foldable ? !collapsed : undefined} onToggle={onToggle} />
      {!collapsed && tasks.length > 0 && <TaskList tasks={tasks} />}
    </>
  )
}

export { TaskList, TaskSection }
