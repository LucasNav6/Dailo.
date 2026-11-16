import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

function Scrim() {
  return <div className="absolute inset-0 z-50 bg-scrim backdrop-blur-[2px]" />
}

function SheetOverlay({ children, className, handleClassName }: { children: ReactNode; className?: string; handleClassName?: string }) {
  return (
    <>
      <Scrim />
      <div className={cn("absolute inset-x-0 bottom-0 z-50 box-border flex flex-col rounded-t-2xl bg-card px-6 pt-3", className)}>
        <span aria-hidden="true" className={cn("mb-2 h-1 w-10 self-center rounded-full bg-border", handleClassName)} />
        {children}
      </div>
    </>
  )
}

function DialogOverlay({ children, role = "alertdialog", className }: { children: ReactNode; role?: "dialog" | "alertdialog"; className?: string }) {
  return (
    <>
      <Scrim />
      <div
        role={role}
        className={cn("absolute inset-x-6 top-1/2 z-50 box-border flex -translate-y-1/2 flex-col gap-3 rounded-[28px] bg-card p-6", className)}
      >
        {children}
      </div>
    </>
  )
}

export { Scrim, SheetOverlay, DialogOverlay }
