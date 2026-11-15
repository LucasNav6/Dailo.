import { TaskCheck } from "@/components/atoms/task-check"
import { cn } from "@/lib/utils"

/** Subtarea sangrada bajo su tarea: círculo de 18px (22px con `large`) y texto de 15px. */
function SubtaskRow({ title, checked = false, large = false, className }: { title: string; checked?: boolean; large?: boolean; className?: string }) {
  return (
    <li className={cn("flex list-none items-center gap-[13px] py-[7px] pl-[42px] text-[15px] leading-[1.35]", className)}>
      <TaskCheck
        checked={checked}
        aria-label={`Completar ${title}`}
        className={large ? undefined : "size-[18px] [&_svg]:size-2.5"}
      />
      <span className={cn(checked ? "text-muted-foreground line-through decoration-wavy decoration-1" : "text-foreground")}>{title}</span>
    </li>
  )
}

export { SubtaskRow }
