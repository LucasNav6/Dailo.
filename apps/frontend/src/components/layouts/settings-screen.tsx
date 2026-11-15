import type { ReactNode } from "react"
import { BackBar } from "@/components/molecules/back-bar"
import { cn } from "@/lib/utils"

const GAP = { 0: "gap-0", 4: "gap-4", 6: "gap-6", 7: "gap-7" } as const

/** Estructura de una subpantalla de Configuración: barra con volver y título, y contenido apilado con `gap`. */
function SettingsScreen({ title, gap = 4, children, backTo }: { title: string; gap?: 0 | 4 | 6 | 7; children: ReactNode; backTo?: string }) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", GAP[gap])}>
      <BackBar title={title} backLabel="Volver a Configuración" backTo={backTo} />
      {children}
    </div>
  )
}

export { SettingsScreen }
