import { Emphasis } from "@/shared/components/atoms/emphasis";
import { ListHeader } from "@/shared/components/molecules/list-header";

export function InboxHeaderView({ count }: { count?: number }) {
  return <ListHeader eyebrow={count === undefined ? "Inbox" : `Inbox · ${count}`} title={<>Tu <Emphasis>inbox.</Emphasis></>} />;
}
