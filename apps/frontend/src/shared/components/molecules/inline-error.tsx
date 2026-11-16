import type { ReactNode } from "react"
import { RiErrorWarningLine } from "@remixicon/react"
import { cn } from "@/shared/libs/utils"

function InlineError({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "muted" }) {
  return (
    <div role="alert" className={cn("flex items-center gap-2 text-sm", tone === "muted" ? "text-muted-foreground" : "text-danger-foreground")}>
      <span className="inline-flex text-danger [&_svg]:size-[18px]">
        <RiErrorWarningLine aria-hidden />
      </span>
      {children}
    </div>
  )
}

export { InlineError }
