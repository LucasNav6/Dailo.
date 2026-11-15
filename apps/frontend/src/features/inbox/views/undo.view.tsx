import { Snackbar } from "@/components/molecules/snackbar";
import { InboxHeader } from "../components/inbox-header";
import { InboxList } from "../components/inbox-list";
import { INBOX_ENTRIES } from "../data";

/** Tras descartar un elemento: el Inbox queda con tres y aparece "Deshacer". */
export function InboxUndoView() {
  return (
    <>
      <InboxHeader count={INBOX_ENTRIES.length - 1} />
      <InboxList entries={INBOX_ENTRIES.slice(1)} />
      <div className="absolute inset-x-4 bottom-[100px]">
        <Snackbar message="Idea descartada" actionLabel="Deshacer" />
      </div>
    </>
  );
}
