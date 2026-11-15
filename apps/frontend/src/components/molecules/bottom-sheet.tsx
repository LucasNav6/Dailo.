import type { ReactNode } from "react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/molecules/sheet"
import { cn } from "@/lib/utils"

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título accesible (no visible); el título visual va dentro de `children`. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** Hoja inferior real (Radix) con el aspecto del diseño: radio 16px, asa de arrastre y sin botón de cierre. */
function BottomSheet({ open, onOpenChange, label, children, className }: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn("mx-auto max-h-[92svh] max-w-xl gap-1 overflow-y-auto rounded-t-2xl border-0 bg-card px-6 pt-3 pb-6", className)}
      >
        <SheetTitle className="sr-only">{label}</SheetTitle>
        <SheetDescription className="sr-only">{label}</SheetDescription>
        <span aria-hidden="true" className="mb-2 h-1 w-10 shrink-0 self-center rounded-full bg-border" />
        {children}
      </SheetContent>
    </Sheet>
  )
}

export { BottomSheet }
