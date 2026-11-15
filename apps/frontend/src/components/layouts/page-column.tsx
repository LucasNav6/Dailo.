import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Columna de lectura de las pantallas de lista: ancho máximo de móvil ampliado, centrada en escritorio. */
function PageColumn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto flex w-full max-w-xl flex-1 flex-col", className)}>{children}</div>
}

export { PageColumn }
