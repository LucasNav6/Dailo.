import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react"
import { TaskList, type TaskItem } from "./task-section"

type CompletedGroupProps = { tasks: TaskItem[]; open: boolean; onToggle?: () => void }

function CompletedGroup({ tasks, open, onToggle }: CompletedGroupProps) {
  const Chevron = open ? RiArrowUpSLine : RiArrowDownSLine
  return (
    <section aria-label="Completadas">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="mt-3.5 flex min-h-11 w-full items-center justify-between border-t border-border pt-1.5 text-left text-sm font-semibold text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span>Completadas · {tasks.length}</span>
        <span className="inline-flex [&_svg]:size-[22px]">
          <Chevron aria-hidden />
        </span>
      </button>
      {open && <TaskList tasks={tasks} />}
    </section>
  )
}

export { CompletedGroup }
