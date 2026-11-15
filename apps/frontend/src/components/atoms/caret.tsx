import { cn } from "@/lib/utils"

/** Cursor de texto de 2px que simula el foco en un campo (mockups). */
function Caret({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block w-0.5 bg-foreground", className)} />
}

export { Caret }
