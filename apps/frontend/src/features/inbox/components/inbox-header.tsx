import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";

export function InboxHeader({ count }: { count?: number }) {
  return <ListHeader eyebrow={count === undefined ? "Inbox" : `Inbox · ${count}`} title={<>Tu <Emphasis>inbox.</Emphasis></>} />;
}
