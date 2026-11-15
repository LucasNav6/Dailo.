import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";

/** Cabecera de Inbox: contador como eyebrow y título. `count` omitido muestra solo "Inbox". */
export function InboxHeader({ count }: { count?: number }) {
  return <ListHeader eyebrow={count === undefined ? "Inbox" : `Inbox · ${count}`} title={<>Tu <Emphasis>inbox.</Emphasis></>} />;
}
