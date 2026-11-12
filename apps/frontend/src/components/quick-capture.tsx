import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuickCapture } from "@/hooks/use-quick-capture";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type QuickCaptureProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCaptured: () => void;
};

export function QuickCapture({ open, onOpenChange, onCaptured }: QuickCaptureProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const capture = useQuickCapture();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const close = () => {
    capture.reset();
    setConfirmDiscard(false);
    onOpenChange(false);
  };

  // Solo se pide confirmación si hay texto sin guardar.
  const requestClose = (next: boolean) => {
    if (next) return onOpenChange(true);
    if (capture.status === "saving") return;
    if (capture.hasDraft) setConfirmDiscard(true);
    else close();
  };

  const submit = async () => {
    if (await capture.submit()) {
      onOpenChange(false);
      onCaptured();
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void submit();
    }
  };

  const focusTextarea = (event: Event) => {
    event.preventDefault();
    textareaRef.current?.focus();
  };

  const form = (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label htmlFor="quick-capture-text" className="text-sm font-medium">
        ¿Qué tenés en mente?
      </label>
      <Textarea
        id="quick-capture-text"
        ref={textareaRef}
        value={capture.text}
        onChange={(event) => capture.setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Escribí una idea, tarea o recordatorio..."
        rows={4}
        className="max-h-[40svh] resize-none"
        aria-invalid={capture.status === "error"}
        aria-describedby="quick-capture-hint quick-capture-error"
        disabled={capture.status === "saving"}
      />
      <p id="quick-capture-error" role="alert" className="text-sm text-destructive empty:hidden">
        {capture.status === "error" ? "No se pudo guardar. Tu texto sigue acá, probá de nuevo." : null}
      </p>
      <div className="flex items-center justify-between gap-3">
        <p id="quick-capture-hint" className="text-sm text-muted-foreground">
          Se guardará en Inbox
        </p>
        <Button type="submit" disabled={!capture.canSubmit} aria-busy={capture.status === "saving"}>
          {capture.status === "saving" && <RiLoader4Line className="animate-spin" aria-hidden />}
          Capturar
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={requestClose}>
          <DialogContent className="sm:max-w-md" onOpenAutoFocus={focusTextarea}>
            <DialogHeader>
              <DialogTitle>Captura rápida</DialogTitle>
              <DialogDescription className="sr-only">Guardá una idea, tarea o recordatorio en Inbox.</DialogDescription>
            </DialogHeader>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={requestClose}>
          <SheetContent
            side="bottom"
            className="max-h-svh rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onOpenAutoFocus={focusTextarea}
          >
            <SheetHeader className="p-0">
              <SheetTitle>Captura rápida</SheetTitle>
              <SheetDescription className="sr-only">Guardá una idea, tarea o recordatorio en Inbox.</SheetDescription>
            </SheetHeader>
            {form}
          </SheetContent>
        </Sheet>
      )}
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar la captura?</AlertDialogTitle>
            <AlertDialogDescription>Todavía no se guardó. Si cerrás, se pierde el texto.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir escribiendo</AlertDialogCancel>
            <AlertDialogAction onClick={close}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
