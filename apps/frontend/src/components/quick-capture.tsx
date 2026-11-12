import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { RiArrowUpLine, RiInboxLine, RiLoader4Line } from "@remixicon/react";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
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
    <form onSubmit={onSubmit} className="grid gap-2">
      <Textarea
        ref={textareaRef}
        value={capture.text}
        onChange={(event) => capture.setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="¿Qué tenés en mente?"
        aria-label="¿Qué tenés en mente?"
        rows={4}
        className="max-h-[40svh] min-h-28 resize-none rounded-none border-0 bg-transparent p-0 pr-8 text-lg leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent md:text-lg"
        aria-invalid={capture.status === "error"}
        aria-describedby="quick-capture-error"
        disabled={capture.status === "saving"}
      />
      <p id="quick-capture-error" role="alert" className="text-sm text-destructive empty:hidden">
        {capture.status === "error" ? "No se pudo guardar. Tu texto sigue acá, probá de nuevo." : null}
      </p>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <RiInboxLine className="size-4" aria-hidden />
          Inbox
        </span>
        <Button
          type="submit"
          size="icon-lg"
          className="rounded-full"
          aria-label="Capturar en Inbox"
          disabled={!capture.canSubmit}
          aria-busy={capture.status === "saving"}
        >
          {capture.status === "saving" ? <RiLoader4Line className="animate-spin" aria-hidden /> : <RiArrowUpLine aria-hidden />}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={requestClose}>
          <DialogContent className="sm:max-w-md gap-3" onOpenAutoFocus={focusTextarea}>
            <DialogTitle className="sr-only">Captura rápida</DialogTitle>
            <DialogDescription className="sr-only">Guardá una idea, tarea o recordatorio en Inbox.</DialogDescription>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={requestClose}>
          <SheetContent
            side="bottom"
            className="max-h-svh rounded-t-2xl px-5 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onOpenAutoFocus={focusTextarea}
          >
            <SheetTitle className="sr-only">Captura rápida</SheetTitle>
            <SheetDescription className="sr-only">Guardá una idea, tarea o recordatorio en Inbox.</SheetDescription>
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
