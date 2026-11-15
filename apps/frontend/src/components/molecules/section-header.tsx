import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Encabezado de grupo: "ESENCIALES" a la izquierda y el conteo ("1 de 3") a la derecha. */
function SectionHeader({ title, meta, className }: { title: ReactNode; meta?: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-3.5 mb-0.5 flex items-center justify-between text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase", className)}>
      <span>{title}</span>
      {meta && <span className="text-sm font-medium tracking-normal normal-case text-muted-foreground">{meta}</span>}
    </div>
  )
}

export { SectionHeader }
