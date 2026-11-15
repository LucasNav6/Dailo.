import { LinkifiedText } from "@/components/atoms/linkified-text"
import { TaskCheck } from "@/components/atoms/task-check"
import { useRef } from "react"
import { useCompletionEffect } from "@/lib/use-completion-effect"
import { cn } from "@/lib/utils"

/** Subtarea sangrada bajo su tarea: círculo de 18px (22px con `large`) y texto de 15px. */
function SubtaskRow({ title, checked = false, large = false, className, onCheckedChange }: { title: string; checked?: boolean; large?: boolean; className?: string; onCheckedChange?: (checked: boolean) => void }) {
  const checkRef = useRef<HTMLButtonElement>(null)
  const animating = useCompletionEffect(checked, checkRef)
  return (
    <li className={cn("flex list-none items-center gap-[13px] py-[7px] pl-[42px] text-[15px] leading-[1.35]", className)}>
      <TaskCheck
        ref={checkRef}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
        aria-label={`Completar ${title}`}
        className={cn(!large && "size-[18px] [&_svg]:size-2.5", animating && "anim-pop")}
      />
      <span className={cn("transition-colors duration-300", checked ? "text-muted-foreground" : "text-foreground")}>
        <span className={cn(checked && "strike", animating && "strike-anim")}>
          <LinkifiedText text={title} />
        </span>
      </span>
    </li>
  )
}

export { SubtaskRow }
