import { ComposeSheet } from "@/components/layouts/compose-sheet";
import { EmptyInbox } from "../components/empty-inbox";
import { InboxHeader } from "../components/inbox-header";

export function InboxCaptureView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyInbox />
      <ComposeSheet placeholder="¿Qué tenés en la cabeza?" canSave={false} />
    </>
  );
}
