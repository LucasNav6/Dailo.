import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";

/** Cabecera de Tal vez: contador como eyebrow y título "Para después.". */
export function SomedayHeader({ eyebrow }: { eyebrow: string }) {
  return <ListHeader eyebrow={eyebrow} title={<>Para <Emphasis>después.</Emphasis></>} />;
}
