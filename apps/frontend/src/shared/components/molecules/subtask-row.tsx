import { RiDeleteBinLine } from "@remixicon/react"
import { LinkifiedText } from "@/components/atoms/linkified-text"
import { TaskCheck } from "@/components/atoms/task-check"
import { useRef } from "react"
import { useCompletionEffect } from "@/lib/use-completion-effect"
import { cn } from "@/lib/utils"

function SubtaskRow({ title, checked = false, large = false, className, onCheckedChange, onRemove }: { title: string; checked?: boolean; large?: boolean; className?: string; onCheckedChange?: (checked: boolean) => void; onRemove?: () => void }) {
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
      <span className={cn("min-w-0 flex-1 transition-colors duration-300", checked ? "text-muted-foreground" : "text-foreground")}>
        <span className={cn(checked && "strike", animating && "strike-anim")}>
          <LinkifiedText text={title} />
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Eliminar subtarea ${title}`}
          onClick={onRemove}
          className="-my-1.5 -mr-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-danger outline-none hover:bg-danger-soft focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <RiDeleteBinLine className="size-[18px]" aria-hidden />
        </button>
      )}
    </li>
  )
}

export { SubtaskRow }
