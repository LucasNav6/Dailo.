import type { ReactNode } from "react"
import { RiArrowLeftLine } from "@remixicon/react"
import { IconButton } from "@/components/atoms/icon-button"

/** Barra de subpantalla: botón volver de 44px y título de 20px. */
function BackBar({ title, backLabel, actions }: { title: ReactNode; backLabel: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <IconButton aria-label={backLabel} tabIndex={-1}>
        <RiArrowLeftLine aria-hidden />
      </IconButton>
      <h2 className="flex-1 text-xl font-semibold">{title}</h2>
      {actions}
    </div>
  )
}

export { BackBar }
