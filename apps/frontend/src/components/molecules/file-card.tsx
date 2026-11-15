import { RiFileLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

/** Archivo elegido: baldosa de 44px con icono, nombre de 16px y detalle de 13px. */
function FileCard({ name, detail, className }: { name: string; detail: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3.5 py-2", className)}>
      <span className="grid size-11 place-items-center rounded-xl bg-selected text-foreground [&_svg]:size-[22px]">
        <RiFileLine aria-hidden />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-medium">{name}</span>
        <span className="text-[13px] text-muted-foreground">{detail}</span>
      </span>
    </div>
  )
}

export { FileCard }
