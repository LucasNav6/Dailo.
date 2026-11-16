import type { ReactNode } from "react"
import { BackBar } from "@/shared/components/molecules/back-bar"
import { cn } from "@/shared/libs/utils"

const GAP = { 0: "gap-0", 4: "gap-4", 6: "gap-6", 7: "gap-7" } as const

function SettingsScreen({ title, gap = 4, children, backTo }: { title: string; gap?: 0 | 4 | 6 | 7; children: ReactNode; backTo?: string }) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", GAP[gap])}>
      <BackBar title={title} backLabel="Volver a Configuración" backTo={backTo} />
      {children}
    </div>
  )
}

export { SettingsScreen }
