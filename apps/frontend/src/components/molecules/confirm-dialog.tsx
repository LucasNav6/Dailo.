import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog"

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

function ConfirmDialog({ open, onOpenChange, title, description, children }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col gap-3 sm:max-w-sm">
        <AlertDialogTitle className="font-display text-2xl leading-[1.15] font-semibold text-foreground">{title}</AlertDialogTitle>
        {description ? (
          <AlertDialogDescription className="text-[15px] leading-normal text-muted-foreground">{description}</AlertDialogDescription>
        ) : (
          <AlertDialogDescription className="sr-only">{title}</AlertDialogDescription>
        )}
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
