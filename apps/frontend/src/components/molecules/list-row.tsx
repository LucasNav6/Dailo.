import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Fila de lista de ajustes: icono de 24px, título de 16px, subtítulo de 14px y borde inferior. `danger` tiñe el texto; `trailing` va a la derecha. */
function ListRow({ icon, title, subtitle, danger = false, trailing }: { icon: ReactNode; title: string; subtitle?: string; danger?: boolean; trailing?: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-3.5 border-b border-border">
      <span className={cn("inline-flex w-6 justify-center [&_svg]:size-[22px]", danger ? "text-danger-foreground" : "text-subtle")}>{icon}</span>
      <span className="flex flex-1 flex-col gap-px">
        <span className={cn("text-base", danger ? "text-danger-foreground" : "text-foreground")}>{title}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
      </span>
      {trailing}
    </div>
  )
}

export { ListRow }
