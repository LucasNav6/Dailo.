import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

function DialogField({ children, invalid = false }: { children: ReactNode; invalid?: boolean }) {
  return <div className={cn("flex min-h-12 items-center border-b-2 text-[17px]", invalid ? "border-danger" : "border-border")}>{children}</div>
}

export { DialogField }
