import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { EmptyInbox } from "../components/empty-inbox";
import { InboxHeader } from "../components/inbox-header";

/** Diálogo al cerrar la captura con texto sin guardar. */
export function InboxDiscardDraftView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyInbox />
      <DialogOverlay>
        <h2 className="font-display text-2xl leading-[1.15] font-semibold text-foreground">¿Descartar lo que escribiste?</h2>
        <p className="text-[15px] leading-normal text-muted-foreground">Todavía no se guardó. Si salís ahora, se pierde.</p>
        <Button>Seguir editando</Button>
        <Button variant="ghost" className="h-11 px-2 text-danger-foreground">Descartar</Button>
      </DialogOverlay>
    </>
  );
}
