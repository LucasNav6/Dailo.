import { InboxHeader } from "../components/inbox-header";
import { InboxList } from "../components/inbox-list";
import { INBOX_ENTRIES } from "../data";

export function InboxListView() {
  return (
    <>
      <InboxHeader count={INBOX_ENTRIES.length} />
      <InboxList entries={INBOX_ENTRIES} />
    </>
  );
}
