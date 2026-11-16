import type { ReactNode } from "react"
import { cn } from "@/shared/libs/utils"

function PageColumn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto flex w-full max-w-xl flex-1 flex-col", className)}>{children}</div>
}

export { PageColumn }
