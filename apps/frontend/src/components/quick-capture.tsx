import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { RiArrowUpLine, RiCloseLine, RiInboxArchiveLine, RiLoader4Line } from "@remixicon/react";
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
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
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

  const modKey = typeof navigator !== "undefined" && /Mac/.test(navigator.platform) ? "⌘" : "Ctrl";

  const form = (
    <form onSubmit={onSubmit} className="flex flex-col">
      <Textarea
        ref={textareaRef}
        value={capture.text}
        onChange={(event) => capture.setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="¿Qué tenés en mente?"
        aria-label="¿Qué tenés en mente?"
        rows={4}
        className="max-h-[40svh] min-h-32 resize-none rounded-none border-0 bg-transparent px-5 pt-1 pb-3 text-lg leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent md:text-lg"
        aria-invalid={capture.status === "error"}
        aria-describedby="quick-capture-error"
        disabled={capture.status === "saving"}
      />
      <p id="quick-capture-error" role="alert" className="px-5 pb-2 text-sm text-destructive empty:hidden">
        {capture.status === "error" ? "No se pudo guardar. Tu texto sigue acá, probá de nuevo." : null}
      </p>
      <div className="flex items-center justify-between gap-3 bg-muted/50 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5 text-sm font-medium">
          <RiInboxArchiveLine className="size-4 text-primary" aria-hidden />
          Inbox
        </span>
        <div className="flex items-center gap-3">
          {isDesktop && (
            <kbd className="font-sans text-xs text-muted-foreground" aria-hidden>
              {modKey} ↵
            </kbd>
          )}
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
      </div>
    </form>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={requestClose}>
          <DialogContent showCloseButton={false} className="gap-0 overflow-hidden rounded-2xl p-0 pt-5 sm:max-w-md" onOpenAutoFocus={focusTextarea}>
            <DialogTitle className="sr-only">Captura rápida</DialogTitle>
            <DialogDescription className="sr-only">Guardá una idea, tarea o recordatorio en Inbox.</DialogDescription>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={requestClose}>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="max-h-svh gap-0 rounded-t-2xl p-0"
            onOpenAutoFocus={focusTextarea}
          >
            <div className="relative flex h-12 items-center justify-center">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" aria-hidden />
              <SheetClose asChild>
                <Button variant="secondary" size="icon-sm" className="absolute top-2.5 right-4 rounded-full" aria-label="Cerrar">
                  <RiCloseLine aria-hidden />
                </Button>
              </SheetClose>
            </div>
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
