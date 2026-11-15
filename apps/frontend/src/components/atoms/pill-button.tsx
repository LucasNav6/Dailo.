import * as React from "react"
import { cn } from "@/lib/utils"

/** Botón en píldora (p. ej. "Volver a hoy"): fondo seleccionado, texto de 14px. */
function PillButton({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 self-start rounded-full bg-selected pr-3.5 pl-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-selected/80 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-[18px]",
        className
      )}
      {...props}
    />
  )
}

export { PillButton }
