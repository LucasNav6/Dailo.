import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Fila de ajuste: icono opcional de 24px, etiqueta de 15px y valor o control a la derecha.
 * `comfortable` sube el alto mínimo de 44 a 52px (filas con interruptor).
 */
function SettingRow({ icon, label, children, comfortable = false, className }: { icon?: ReactNode; label: ReactNode; children?: ReactNode; comfortable?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center", icon ? "gap-3.5" : "justify-between gap-4", comfortable ? "min-h-[52px]" : "min-h-11", className)}>
      {icon && <span className="inline-flex w-6 justify-center text-subtle [&_svg]:size-[22px]">{icon}</span>}
      <span className="flex-1 text-[15px]">{label}</span>
      {children}
    </div>
  )
}

/** Valor de un ajuste ("07:00", "07:00 – 12:00") con cifras tabulares. */
function SettingValue({ children }: { children: ReactNode }) {
  return <span className="text-[15px] font-medium text-foreground tabular-nums">{children}</span>
}

export { SettingRow, SettingValue }
