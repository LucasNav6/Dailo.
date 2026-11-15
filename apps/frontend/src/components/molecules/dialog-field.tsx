import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Campo de texto de diálogo con solo línea inferior de 2px; `invalid` la pinta en rojo fuerte. */
function DialogField({ children, invalid = false }: { children: ReactNode; invalid?: boolean }) {
  return <div className={cn("flex min-h-12 items-center border-b-2 text-[17px]", invalid ? "border-danger" : "border-border")}>{children}</div>
}

export { DialogField }
