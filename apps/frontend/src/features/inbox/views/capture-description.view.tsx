import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { EmptyInbox } from "../components/empty-inbox";
import { InboxHeader } from "../components/inbox-header";

export function InboxCaptureDescriptionView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyInbox />
      <ComposeSheet
        placeholder="¿Qué tenés en la cabeza?"
        value="Llamar al contador por el monotributo"
        description="Preguntar por la categoría y el vencimiento de la cuota."
        canSave
      />
    </>
  );
}
