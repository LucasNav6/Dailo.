import { cn } from "@/lib/utils"

function Caret({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block w-0.5 bg-foreground", className)} />
}

export { Caret }
