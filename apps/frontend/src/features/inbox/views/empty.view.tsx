import { EmptyInbox } from "../components/empty-inbox";
import { InboxHeader } from "../components/inbox-header";

/** Inbox sin elementos. */
export function InboxEmptyView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyInbox />
    </>
  );
}
