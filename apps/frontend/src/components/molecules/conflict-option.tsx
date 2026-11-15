import { RiCircleLine, RiRecordCircleLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

type ConflictOptionProps = { label: string; title: string; detail: string; selected?: boolean };

/** Opción al resolver un conflicto de importación: radio, etiqueta en mayúsculas, título y detalle. */
function ConflictOption({ label, title, detail, selected = false }: ConflictOptionProps) {
  return (
    <div className="flex items-start gap-3.5 border-b border-border py-3.5">
      <span className={cn("inline-flex pt-0.5 [&_svg]:size-[22px]", selected ? "text-foreground" : "text-muted-foreground")}>
        {selected ? <RiRecordCircleLine aria-hidden /> : <RiCircleLine aria-hidden />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">{label}</span>
        <span className="text-[17px]">{title}</span>
        <span className="text-sm text-muted-foreground">{detail}</span>
      </span>
    </div>
  )
}

export { ConflictOption }
