import * as React from "react"
import { cn } from "@/lib/utils"

function Chip({ className, selected = false, type = "button", ...props }: React.ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected ? "bg-primary text-primary-foreground" : "bg-selected text-foreground hover:bg-selected/70",
        className
      )}
      {...props}
    />
  )
}

export { Chip }
