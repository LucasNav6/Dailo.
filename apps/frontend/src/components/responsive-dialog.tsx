import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
};

/** Diálogo compacto en desktop y bottom sheet en mobile. */
export function ResponsiveDialog({ open, onOpenChange, title, description, children }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
        <DialogTitle className="px-5 pt-5 text-base font-semibold">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[92svh] gap-0 overflow-y-auto p-0">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" aria-hidden />
        <SheetTitle className="px-5 pt-3 text-base font-semibold">{title}</SheetTitle>
        <SheetDescription className="sr-only">{description}</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}
