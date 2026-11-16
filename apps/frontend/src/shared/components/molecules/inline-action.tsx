import * as React from "react"
import { cn } from "@/lib/utils"

function InlineAction({ icon, className, children, type = "button", ...props }: React.ComponentProps<"button"> & { icon: React.ReactNode }) {
  return (
    <button
      type={type}
      className={cn(
        "mt-1 inline-flex h-11 items-center gap-[15px] self-start pl-[5px] text-[15px] font-semibold text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-[22px]",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export { InlineAction }
