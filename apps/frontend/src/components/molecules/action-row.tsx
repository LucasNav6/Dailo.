import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Acción de menú en hoja inferior: icono de 22px y etiqueta de 17px; `danger` usa el rojo fuerte y `danger-soft` el oscuro. */
function ActionRow({ icon, children, tone = "default" }: { icon: ReactNode; children: ReactNode; tone?: "default" | "danger" | "danger-soft" }) {
  return (
    <div className={cn("flex min-h-[52px] items-center gap-4 text-[17px]", tone === "danger" ? "text-danger" : tone === "danger-soft" ? "text-danger-foreground" : "text-foreground")}>
      <span className="inline-flex [&_svg]:size-[22px]">{icon}</span>
      {children}
    </div>
  )
}

export { ActionRow }
