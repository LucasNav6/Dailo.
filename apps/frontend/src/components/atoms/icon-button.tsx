import * as React from "react"
import { Button } from "@/components/atoms/button"
import { cn } from "@/lib/utils"

/** Botón de icono de 44px (objetivo táctil mínimo). Requiere aria-label. */
function IconButton({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "size" | "variant"> & { "aria-label": string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-[22px]", className)}
      {...props}
    />
  )
}

export { IconButton }
