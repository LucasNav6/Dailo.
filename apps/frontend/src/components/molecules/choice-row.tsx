import type { ReactNode } from "react"
import { RiCircleLine, RiRecordCircleLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

type ChoiceRowProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Icono propio; por defecto un radio (vacío o relleno según `selected`). */
  icon?: ReactNode;
  selected?: boolean;
};

/** Opción de hoja inferior: icono, título de 17px y descripción opcional, con 56px de alto mínimo. */
function ChoiceRow({ title, description, icon, selected = false }: ChoiceRowProps) {
  return (
    <div className="flex min-h-14 items-center gap-4">
      <span className={cn("inline-flex [&_svg]:size-[22px]", selected ? "text-foreground" : "text-muted-foreground")}>
        {icon ?? (selected ? <RiRecordCircleLine aria-hidden /> : <RiCircleLine aria-hidden />)}
      </span>
      <span className="flex flex-1 flex-col gap-px">
        <span className="text-[17px] text-foreground">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
    </div>
  )
}

export { ChoiceRow }
