import { RiArrowLeftLine, RiMore2Line } from "@remixicon/react"
import { IconButton } from "@/components/atoms/icon-button"
import { cn } from "@/lib/utils"

/** Barra superior de una vista de detalle: volver a la izquierda y, opcionalmente, "Más opciones" a la derecha. */
function DetailBar({ withMore = true, className }: { withMore?: boolean; className?: string }) {
  return (
    <div className={cn("-mx-3 -mt-2 mb-2 flex items-center justify-between", className)}>
      <IconButton aria-label="Volver" className="text-foreground">
        <RiArrowLeftLine aria-hidden />
      </IconButton>
      {withMore && (
        <IconButton aria-label="Más opciones">
          <RiMore2Line aria-hidden />
        </IconButton>
      )}
    </div>
  )
}

export { DetailBar }
