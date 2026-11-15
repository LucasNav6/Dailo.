import { EmptyInbox } from "../components/empty-inbox";
import { InboxHeader } from "../components/inbox-header";

export function InboxEmptyView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyInbox />
    </>
  );
}
