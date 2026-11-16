import { RiStarLine } from "@remixicon/react"
import { cn } from "@/shared/libs/utils"
import { TaskList, type TaskItem } from "./task-section"

type EssentialsBoxProps = { done: number; max: number; tasks: TaskItem[] }

function EssentialsBox({ done, max, tasks }: EssentialsBoxProps) {
  return (
    <section aria-label="Esenciales" className="mt-3 mb-1 rounded-2xl border-2 border-primary bg-card px-4 pt-3.5 pb-1.5">
      <div className="flex items-center gap-2.5 pb-1.5">
        <span className="grid size-7 place-items-center rounded-full bg-primary text-card">
          <RiStarLine className="size-4" aria-hidden />
        </span>
        <h2 className="text-[13px] font-bold tracking-[0.06em] text-foreground uppercase">Esenciales</h2>
        <span className="flex-1" />
        <span className="inline-flex gap-1" aria-hidden="true">
          {Array.from({ length: max }, (_, index) => (
            <span key={index} className={cn("size-2 rounded-full border-2 border-primary", index < done ? "bg-primary" : "bg-transparent")} />
          ))}
        </span>
        <span className="text-[13px] text-muted-foreground">{done} de {max}</span>
      </div>
      <TaskList tasks={tasks} />
    </section>
  )
}

export { EssentialsBox }
