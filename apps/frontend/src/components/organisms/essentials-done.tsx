import { RiArrowDownSLine, RiArrowUpSLine, RiCheckLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import { TaskList, type TaskItem } from "./task-section"

type EssentialsDoneProps = {
  count: number
  total: number
  lead: string
  emphasis: string
  open: boolean
  onToggle?: () => void
  tasks: TaskItem[]
}

function EssentialsDone({ count, total, lead, emphasis, open, onToggle, tasks }: EssentialsDoneProps) {
  const Chevron = open ? RiArrowUpSLine : RiArrowDownSLine
  return (
    <section aria-label="Esenciales listos" className={cn("mt-3 mb-1 rounded-2xl bg-primary px-4 pt-1", open ? "pb-2.5" : "pb-1")}>
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex min-h-14 w-full items-center gap-3 rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
          <RiCheckLine className="size-4" aria-hidden />
        </span>
        <span className="flex min-w-0 flex-col gap-px">
          <span className="text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-border uppercase">
            Esenciales listos · {count} de {total}
          </span>
          <span className="truncate font-display text-[19px] leading-[1.15] font-semibold whitespace-nowrap text-card">
            {lead} <em className="font-medium italic">{emphasis}</em>
          </span>
        </span>
        <span className="flex-1" />
        <span className="inline-flex text-card [&_svg]:size-[22px]">
          <Chevron aria-hidden />
        </span>
      </button>
      {open && (
        <div className="mt-1 text-border [&_button]:text-border [&_label]:text-border">
          <TaskList tasks={tasks} />
        </div>
      )}
    </section>
  )
}

export { EssentialsDone }
