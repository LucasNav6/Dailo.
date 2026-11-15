import * as React from "react"
import { cn } from "@/lib/utils"

type DragHandleProps = Omit<React.ComponentProps<"button">, "type"> & { active?: boolean }

function DragHandle({ className, active = false, ...props }: DragHandleProps) {
  return (
    <button
      type="button"
      data-slot="drag-handle"
      className={cn(
        "inline-flex h-11 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing",
        active ? "text-foreground" : "text-faint",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="6" r="1.7" />
        <circle cx="9" cy="12" r="1.7" />
        <circle cx="9" cy="18" r="1.7" />
        <circle cx="15" cy="6" r="1.7" />
        <circle cx="15" cy="12" r="1.7" />
        <circle cx="15" cy="18" r="1.7" />
      </svg>
    </button>
  )
}

export { DragHandle }
