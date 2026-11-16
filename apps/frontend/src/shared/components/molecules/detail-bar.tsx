import { RiArrowLeftLine, RiMore2Line } from "@remixicon/react"
import { IconButton } from "@/components/atoms/icon-button"
import { cn } from "@/lib/utils"

function DetailBar({ withMore = true, className, onBack, onMore }: { withMore?: boolean; className?: string; onBack?: () => void; onMore?: () => void }) {
  return (
    <div className={cn("-mx-3 -mt-2 mb-2 flex items-center justify-between", className)}>
      <IconButton aria-label="Volver" className="text-foreground" onClick={onBack}>
        <RiArrowLeftLine aria-hidden />
      </IconButton>
      {withMore && (
        <IconButton aria-label="Más opciones" onClick={onMore}>
          <RiMore2Line aria-hidden />
        </IconButton>
      )}
    </div>
  )
}

export { DetailBar }
